'use strict';

const config = require('config');
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

    handlePost(ctx, errors, formdata, session) {
        super.handlePost(ctx, errors, formdata, session);
        return [ctx, errors];
    }

    persistFormData() {
        return {};
    }

    setEligibilityCookie(req, res, nextStepUrl, fieldKey, fieldValue) {
        eligibilityCookie.setCookie(req, res, nextStepUrl, fieldKey, fieldValue);
    }

    previousQuestionsAnswered(req, ctx, fieldKey) {
        let eligibilityQuestionsList;

        if (Object.keys(config.eligibilityQuestionsProbate).includes(fieldKey)) {
            eligibilityQuestionsList = config.eligibilityQuestionsProbate;
        } else if (Object.keys(config.eligibilityQuestionsIntestacy).includes(fieldKey)) {
            eligibilityQuestionsList = config.eligibilityQuestionsIntestacy;
        } else if (Object.keys(config.eligibilityQuestionsProbateEnglishDeathCert).includes(fieldKey)) {
            eligibilityQuestionsList = config.eligibilityQuestionsProbateEnglishDeathCert;
        } else if (Object.keys(config.eligibilityQuestionsProbateTranslatedDeathCert).includes(fieldKey)) {
            eligibilityQuestionsList = config.eligibilityQuestionsProbateTranslatedDeathCert;
        }

        if (eligibilityQuestionsList) {
            let allPreviousEligibilityQuestionsAnswered = true;

            for (const itemKey of Object.keys(eligibilityQuestionsList)) {
                if (itemKey === fieldKey) {
                    break;
                }

                if (!req.session.form.screeners || !req.session.form.screeners[itemKey] || req.session.form.screeners[itemKey] !== eligibilityQuestionsList[itemKey]) {
                    allPreviousEligibilityQuestionsAnswered = false;
                    break;
                }
            }

            if (!allPreviousEligibilityQuestionsAnswered) {
                return false;
            }
        } else {
            return false;
        }

        return true;
    }
}

module.exports = EligibilityValidationStep;
