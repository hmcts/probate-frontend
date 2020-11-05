'use strict';

const config = require('config');
const ValidationStep = require('app/core/steps/ValidationStep');
const EligibilityCookie = require('app/utils/EligibilityCookie');
const eligibilityCookie = new EligibilityCookie();
const ScreenerValidation = require('app/utils/ScreenerValidation');
const screenerValidation = new ScreenerValidation();

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

    previousQuestionsAnswered(req, ctx, currentScreener) {
        const journeyType = Object.keys(config.intestacyScreeners).includes(currentScreener) ? 'intestacy' : 'probate';
        const screenersList = screenerValidation.getScreeners(journeyType, req.session.form, req.session.featureToggles);

        let allPreviousEligibilityQuestionsAnswered = true;

        for (const itemKey of Object.keys(screenersList)) {
            if (itemKey === currentScreener) {
                break;
            }

            if (!req.session.form.screeners || !req.session.form.screeners[itemKey] || req.session.form.screeners[itemKey] !== screenersList[itemKey]) {
                allPreviousEligibilityQuestionsAnswered = false;
                break;
            }
        }

        if (!allPreviousEligibilityQuestionsAnswered) {
            return false;
        }

        return true;
    }
}

module.exports = EligibilityValidationStep;
