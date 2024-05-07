'use strict';

const {mapValues, map, reduce, escape, isObject, isEmpty, get} = require('lodash');
const UIStepRunner = require('app/core/runners/UIStepRunner');
const JourneyMap = require('app/core/JourneyMap');
const mapErrorsToFields = require('app/components/error').mapErrorsToFields;
const ExecutorsWrapper = require('app/wrappers/Executors');
const config = require('config');
const ServiceMapper = require('app/utils/ServiceMapper');
const FeatureToggle = require('app/utils/FeatureToggle');
const caseTypes = require('app/utils/CaseTypes');
const utils = require('app/components/step-utils');
const moment = require('moment');

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

    constructor(steps, section, resourcePath, i18next, schema, language = 'en') {
        this.steps = steps;
        this.section = section;
        this.resourcePath = resourcePath;
        this.templatePath = `ui/${resourcePath}`;
        this.content = require(`app/resources/${language}/translation/${resourcePath}`);
        this.i18next = i18next;
    }
    previousStepUrl(req, res, ctx) {
        utils.getPreviousUrl(ctx, req, res, this.steps, this.name);
    }

    previousScrennerStepUrl(req, res, ctx) {
        utils.getScrennersPreviousUrl(ctx, req, res, this.steps, this.name);
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
        ctx.language = req.session.language ? req.session.language : 'en';
        if (typeof session.form.userLoggedIn === 'boolean') {
            ctx.userLoggedIn = session.form.userLoggedIn;
        }
        ctx = Object.assign(ctx, req.body);
        ctx = FeatureToggle.appwideToggles(req, ctx, config.featureToggles.appwideToggles);
        ctx.isAvayaWebChatEnabled = ctx.featureToggles && ctx.featureToggles.ft_avaya_webchat && ctx.featureToggles.ft_avaya_webchat === 'true';
        ctx.isWebChatEnabled = config.configFeatureToggles.webchatEnabled;
        ctx.isGaEnabled = config.configFeatureToggles.gaEnabled; // this is a boolean type
        ctx.isDynatraceEnabled = config.environment !== 'prod';
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

    shouldPersistFormData() {
        return true;
    }

    generateContent(ctx, formdata, language = 'en') {
        if (!this.content) {
            throw new ReferenceError(`Step ${this.name} has no content.json in its resource folder`);
        }
        const contentCtx = Object.assign({}, formdata, ctx, this.commonProps);
        this.i18next.changeLanguage(language);

        return mapValues(this.content, (value, key) => this.i18next.t(`${this.resourcePath.replace(/\//g, '.')}.${key}`, contentCtx));
    }

    commonContent(language = 'en') {
        this.i18next.changeLanguage(language);
        const common = require(`app/resources/${language}/translation/common`);
        return mapValues(common, (value, key) => this.i18next.t(`common.${key}`));
    }

    generateFields(language, ctx, errors) {
        let fields = mapValues(ctx, (value, key) => {
            let returnValue;
            const dateName = key.split('-')[0];

            if (key.includes('formattedDate') && ctx[`${dateName}-day`] && ctx[`${dateName}-month`] && ctx[`${dateName}-year`]) {
                const date = moment(ctx[`${dateName}-day`] + '/' + ctx[`${dateName}-month`] + '/' + ctx[`${dateName}-year`], config.dateFormat).parseZone();
                returnValue = utils.formattedDate(date, language);
            } else {
                returnValue = isObject(value) ? value : escape(value);
            }

            return {
                value: returnValue,
                error: false
            };
        });
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

        if (hasMultipleApplicants === false) {
            return (get(session, 'form.declaration.declarationCheckbox', false)).toString() === 'true';
        }

        return [
            get(session, 'haveAllExecutorsDeclared', false).toString(),
            get(session, 'form.executors.invitesSent', false).toString(),
            get(session, 'form.declaration.declarationCheckbox', false).toString()
        ].every(param => param === 'true');
    }

    renderPage(res, html) {
        res.send(html);
    }
}

module.exports = Step;
