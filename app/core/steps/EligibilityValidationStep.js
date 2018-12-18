'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const EligibilityCookie = require('app/utils/EligibilityCookie');
const eligibilityCookie = new EligibilityCookie();

class EligibilityValidationStep extends ValidationStep {

    getContextData(req, res, pageUrl, fieldKey) {
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
        super.handlePost(ctx, formdata);
        delete session.form;
        return [ctx, errors];
    }

    persistFormData() {
        return {};
    }

    setEligibilityCookie(req, res, nextStepUrl, fieldKey, fieldValue) {
        eligibilityCookie.setCookie(req, res, nextStepUrl, fieldKey, fieldValue);
    }
}

module.exports = EligibilityValidationStep;
