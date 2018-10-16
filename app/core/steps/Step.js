'use strict';

const {mapValues, map, reduce, escape, isObject, isEmpty, get} = require('lodash');
const services = require('app/components/services');
const UIStepRunner = require('app/core/runners/UIStepRunner');
const journeyMap = require('app/core/journeyMap');
const mapErrorsToFields = require('app/components/error').mapErrorsToFields;
const ExecutorsWrapper = require('app/wrappers/Executors');

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

    next(ctx) {
        return journeyMap(this, ctx);
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl();
    }

    getContextData(req) {
        const session = req.session;
        let ctx = {};
        Object.assign(ctx, session.form[this.section] || {});
        ctx.sessionID = req.sessionID;
        ctx = Object.assign(ctx, req.body);
        return ctx;
    }

    setEligibilityCookie(req, res, ctx) {
        return [req, res, ctx];
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

    persistFormData(id, formdata, sessionID) {
        return services.saveFormData(id, formdata, sessionID);
    }

    action(ctx, formdata) {
        delete ctx.sessionID;
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
            return get(session, 'form.declaration.declarationCheckbox') === 'true';
        }
        return [
            session.haveAllExecutorsDeclared,
            get(session, 'form.executors.invitesSent'),
            get(session, 'form.declaration.declarationCheckbox')
        ].every(param => param === 'true');
    }
}

module.exports = Step;
