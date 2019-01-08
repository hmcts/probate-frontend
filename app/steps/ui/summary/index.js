'use strict';

const Step = require('app/core/steps/Step');
const OptionGetRunner = require('app/core/runners/OptionGetRunner');
const FieldError = require('app/components/error');
const {isEmpty, map, includes} = require('lodash');
const utils = require('app/components/step-utils');
const services = require('app/components/services');
const ExecutorsWrapper = require('app/wrappers/Executors');
const WillWrapper = require('app/wrappers/Will');
const FormatName = require('app/utils/FormatName');
const FeatureToggle = require('app/utils/FeatureToggle');
const CheckAnswersSummaryJSONObjectBuilder = require('app/utils/CheckAnswersSummaryJSONObjectBuilder');
const checkAnswersSummaryJSONObjBuilder = new CheckAnswersSummaryJSONObjectBuilder();

class Summary extends Step {

    runner() {
        return new OptionGetRunner();
    }

    static getUrl(redirect = '*') {
        return `/summary/${redirect}`;
    }

    * handleGet(ctx, formdata, featureToggles) {
        const result = yield this.validateFormData(ctx, formdata);
        const errors = map(result.errors, err => {
            return FieldError(err.param, err.code, this.resourcePath, ctx);
        });
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        const executorsApplying = executorsWrapper.executorsApplying(true);

        ctx.executorsAlive = executorsWrapper.hasAliveExecutors();
        ctx.executorsWhoDied = executorsWrapper.deadExecutors().map(exec => exec.fullName);
        ctx.executorsDealingWithEstate = executorsApplying.map(exec => exec.fullName);
        ctx.executorsPowerReservedOrRenounced = executorsWrapper.hasRenunciatedOrPowerReserved();
        ctx.isScreeningQuestionToggleEnabled = FeatureToggle.isEnabled(featureToggles, 'screening_questions');
        ctx.isDocumentUploadToggleEnabled = FeatureToggle.isEnabled(featureToggles, 'document_upload');
        ctx.executorsWithOtherNames = executorsWrapper.executorsWithAnotherName().map(exec => exec.fullName);

        utils.updateTaskStatus(ctx, ctx, this.steps);

        return [ctx, !isEmpty(errors) ? errors : null];
    }

    validateFormData(ctx, formdata) {
        return services.validateFormData(formdata, ctx.sessionID);
    }

    generateContent(ctx, formdata) {
        const content = {};

        Object.keys(this.steps)
            .filter((stepName) => stepName !== this.name)
            .forEach((stepName) => {
                const step = this.steps[stepName];
                content[stepName] = step.generateContent(formdata[step.section], formdata);
                content[stepName].url = step.constructor.getUrl();
            });
        content[this.name] = super.generateContent(ctx, formdata);
        content[this.name].url = Summary.getUrl();
        return content;
    }

    generateFields(ctx, errors, formdata) {
        const fields = {};
        Object.keys(this.steps)
            .filter((stepName) => stepName !== this.name)
            .forEach((stepName) => {
                const step = this.steps[stepName];
                if (isEmpty(fields[step.section])) {
                    fields[step.section] = step.generateFields(formdata[step.section], errors, formdata);
                }
            });
        fields[this.section] = super.generateFields(ctx, errors, formdata);
        return fields;
    }

    getContextData(req) {
        const formdata = req.session.form;
        formdata.summary = {'readyToDeclare': includes(req.url, 'declaration')};
        const ctx = super.getContextData(req);
        const willWrapper = new WillWrapper(formdata.will);
        const deceasedName = FormatName.format(formdata.deceased);
        const content = this.generateContent(ctx, formdata);
        const hasCodicils = willWrapper.hasCodicils();

        ctx.deceasedAliasQuestion = content.DeceasedAlias.question
            .replace('{deceasedName}', deceasedName ? deceasedName : content.DeceasedAlias.theDeceased);
        ctx.deceasedMarriedQuestion = (hasCodicils ? content.DeceasedMarried.questionWithCodicil : content.DeceasedMarried.question)
            .replace('{deceasedName}', deceasedName);
        if (formdata.documents && formdata.documents.uploads) {
            ctx.uploadedDocuments = formdata.documents.uploads.map(doc => doc.filename);
        }
        ctx.softStop = this.anySoftStops(formdata, ctx);
        ctx.alreadyDeclared = this.alreadyDeclared(req.session);
        ctx.session = req.session;
        return ctx;
    }

    renderPage(res, html) {
        const formdata = res.req.session.form;
        formdata.checkAnswersSummary = checkAnswersSummaryJSONObjBuilder.build(html);
        res.send(html);
    }

}

module.exports = Summary;
