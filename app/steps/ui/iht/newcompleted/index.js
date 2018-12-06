'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const content = require('app/resources/en/translation/iht/newcompleted');
const EligibilityCookie = require('app/utils/EligibilityCookie');
const eligibilityCookie = new EligibilityCookie();
const pageUrl = '/new-iht-completed';
const fieldKey = 'completed';

class NewIhtCompleted extends ValidationStep {

    static getUrl() {
        return pageUrl;
    }

    getContextData(req, res) {
        const ctx = super.getContextData(req);

        if (req.method === 'GET') {
            const answerValue = eligibilityCookie.getAnswer(req, pageUrl, fieldKey);

            if (answerValue) {
                ctx[fieldKey] = answerValue;
            }
        } else {
            const nextStepUrl = this.nextStepUrl(ctx);

            this.setEligibilityCookie(req, res, nextStepUrl, fieldKey, ctx[fieldKey]);
        }

        return ctx;
    }

    handlePost(ctx, errors, formdata, session) {
        delete session.form;
        return [ctx, errors];
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('ihtNotCompleted');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: content.optionYes, choice: 'completed'}
            ]
        };
    }

    persistFormData() {
        return {};
    }

    setEligibilityCookie(req, res, nextStepUrl, fieldKey, fieldValue) {
        eligibilityCookie.setCookie(req, res, nextStepUrl, fieldKey, fieldValue);
    }
}

module.exports = NewIhtCompleted;
