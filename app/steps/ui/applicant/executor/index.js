'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const content = require('app/resources/en/translation/applicant/executor');
const EligibilityCookie = require('app/utils/EligibilityCookie');
const eligibilityCookie = new EligibilityCookie();
const pageUrl = '/applicant-executor';
const fieldKey = 'executor';

class ApplicantExecutor extends EligibilityValidationStep {

    static getUrl() {
        return pageUrl;
    }

    handlePost(ctx, errors, formdata, session) {
        delete session.form;
        return [ctx, errors];
    }

    getContextData(req, res) {
        return super.getContextData(req, res, pageUrl, fieldKey);
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('notExecutor');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: content.optionYes, choice: 'isExecutor'}
            ]
        };
    }

    persistFormData() {
        return {};
    }
}

module.exports = ApplicantExecutor;
