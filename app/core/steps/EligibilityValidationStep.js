'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const EligibilityCookie = require('app/utils/EligibilityCookie');
const eligibilityCookie = new EligibilityCookie();

class EligibilityValidationStep extends ValidationStep {

    setFeatureTogglesOnCtx(ctx, featureToggles = {}) {
        Object.keys(featureToggles).forEach((toggle) => {
            ctx[toggle] = featureToggles[toggle];
        });
        return ctx;
    }

    getContextData(req, res, pageUrl, fieldKey, featureToggles) {
        let ctx = super.getContextData(req);

        if (req.method === 'GET') {
            const answerValue = eligibilityCookie.getAnswer(req, pageUrl, fieldKey);
            if (answerValue) {
                ctx[fieldKey] = answerValue;
            }
        } else {
            ctx = this.setFeatureTogglesOnCtx(ctx, featureToggles);
            const nextStepUrl = this.nextStepUrl(req, ctx);
            this.setEligibilityCookie(req, res, nextStepUrl, fieldKey, ctx[fieldKey]);
        }

        return ctx;
    }

    handlePost(ctx, errors, formdata) {
        super.handlePost(ctx, formdata);
        return [ctx, errors];
    }

    persistFormData() {
        return {};
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        if (formdata) {
            delete formdata.screeners;
        }
        return [ctx, formdata];
    }

    setEligibilityCookie(req, res, nextStepUrl, fieldKey, fieldValue) {
        eligibilityCookie.setCookie(req, res, nextStepUrl, fieldKey, fieldValue);
    }
}

module.exports = EligibilityValidationStep;
