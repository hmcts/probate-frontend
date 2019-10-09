'use strict';

const {mapValues, map, reduce, escape, isObject, isEmpty, get} = require('lodash');
const UIStepRunner = require('app/core/runners/UIStepRunner');
const JourneyMap = require('app/core/JourneyMap');
const mapErrorsToFields = require('app/components/error').mapErrorsToFields;
const ExecutorsWrapper = require('app/wrappers/Executors');
const config = require('app/config');
const ServiceMapper = require('app/utils/ServiceMapper');
const FeatureToggle = require('app/utils/FeatureToggle');
const caseTypes = require('app/utils/CaseTypes');
const logger = require('app/components/logger')('Init');

class Step {

    static getUrl() {
        throw new ReferenceError('Step must override #url');
    }

    get name() {
        return this.constructor.name;
    }

    runner() {
        return new UIStepRunner();
    }

    get template() {
        if (!this.templatePath) {
            throw new TypeError(`Step ${this.name} has no template file in its resource folder`);
        }
        return `${this.templatePath}/template`;
    }

    constructor(steps, section = null, resourcePath, i18next) {
        this.steps = steps;
        this.section = section;
        this.resourcePath = resourcePath;
        this.templatePath = `ui/${resourcePath}`;
        this.content = require(`app/resources/en/translation/${resourcePath}`);
        this.i18next = i18next;
    }

    next(req, ctx) {
        const journeyMap = new JourneyMap(req.session.journey);
        return journeyMap.nextStep(this, ctx);
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl();
    }

    getContextData(req) {
        const session = req.session;
        let ctx = {};
        Object.assign(ctx, session.form[this.section] || {});
        ctx.sessionID = req.sessionID;
        ctx.caseType = caseTypes.getCaseType(session);
        ctx.userLoggedIn = false;
        ctx.ccdCase = req.session.form.ccdCase;
        if (typeof session.form.userLoggedIn === 'boolean') {
            ctx.userLoggedIn = session.form.userLoggedIn;
        }
        ctx = Object.assign(ctx, req.body);
        ctx = FeatureToggle.appwideToggles(req, ctx, config.featureToggles.appwideToggles);

        return ctx;
    }

    handleGet(ctx) {
        return [ctx];
    }

    handlePost(ctx, errors) {
        return [ctx, errors];
    }

    validate() {
        return [true, []];
    }

    isComplete() {
        return [this.validate()[0], 'noProgress'];
    }

    generateContent(ctx, formdata, lang = 'en') {
        if (!this.content) {
            throw new ReferenceError(`Step ${this.name} has no content.json in its resource folder`);
        }
        const contentCtx = Object.assign({}, formdata, ctx, this.commonProps);
        this.i18next.changeLanguage(lang);

        return mapValues(this.content, (value, key) => this.i18next.t(`${this.resourcePath.replace(/\//g, '.')}.${key}`, contentCtx));
    }

    commonContent(lang = 'en') {
        this.i18next.changeLanguage(lang);
        const common = require('app/resources/en/translation/common');
        return mapValues(common, (value, key) => this.i18next.t(`common.${key}`));
    }

    generateFields(ctx, errors) {
        let fields = mapValues(ctx, (value) => ({value: isObject(value) ? value : escape(value), error: false}));
        if (!isEmpty(errors)) {
            fields = mapErrorsToFields(fields, errors);
        }
        return fields;
    }

    persistFormData(ccdCaseId, formdata, sessionID, req) {
        const formData = ServiceMapper.map(
            'FormData',
            [config.services.orchestrator.url, sessionID]
        );
        return formData.post(req.authToken, req.session.serviceAuthorization, ccdCaseId, formdata);
    }

    action(ctx, formdata) {
        delete ctx.sessionID;
        delete ctx.caseType;
        delete ctx.userLoggedIn;
        delete ctx.featureToggles;
        delete ctx._csrf;
        return [ctx, formdata];
    }

    anySoftStops(formdata, ctx) {
        const softStopsList = map(this.steps, step => step.isSoftStop(formdata, ctx));
        const isSoftStop = reduce(softStopsList, (accumulator, nextElement) => {
            return accumulator || nextElement.isSoftStop;
        }, false);
        return isSoftStop;
    }

    isSoftStop() {
        return {
            'stepName': this.constructor.name,
            'isSoftStop': false
        };
    }

    setHardStop(ctx, reason) {
        ctx.stopReason = reason;
    }

    alreadyDeclared(session) {
        const hasMultipleApplicants = (new ExecutorsWrapper(get(session, 'form.executors'))).hasMultipleApplicants();

        logger.error('LUCA hasMultipleApplicants: ', hasMultipleApplicants);
        logger.error('LUCA session.haveAllExecutorsDeclared: ', session.haveAllExecutorsDeclared);
        logger.error('LUCA form.executors.invitesSent: ', get(session, 'form.executors.invitesSent'));
        logger.error('LUCA form.declaration.declarationCheckbox: ', get(session, 'form.declaration.declarationCheckbox'));

        if (hasMultipleApplicants === false) {
            return get(session, 'form.declaration.declarationCheckbox') === 'true';
        }

        return [
            session.haveAllExecutorsDeclared,
            get(session, 'form.executors.invitesSent'),
            get(session, 'form.declaration.declarationCheckbox')
        ].every(param => param === 'true');
    }

    renderPage(res, html) {
        res.send(html);
    }
}

module.exports = Step;
