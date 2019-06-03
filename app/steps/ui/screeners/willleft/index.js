'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const content = require('app/resources/en/translation/screeners/willleft');
const pageUrl = '/will-left';
const fieldKey = 'left';
const FeatureToggle = require('app/utils/FeatureToggle');

class WillLeft extends EligibilityValidationStep {

    static getUrl() {
        return pageUrl;
    }

    getContextData(req, res) {
        const featureToggles = {
            isIntestacyQuestionsToggleEnabled: FeatureToggle.isEnabled(req.session.featureToggles, 'intestacy_questions')
        };
        return super.getContextData(req, res, pageUrl, fieldKey, featureToggles);
    }

    handlePost(ctx, errors, formdata, session) {
        session.willLeft = ctx.left;
        return super.handlePost(ctx, errors, formdata, session);
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('noWill');
    }

    nextStepOptions(ctx) {
        if (ctx.isIntestacyQuestionsToggleEnabled) {
            return {
                options: [
                    {key: fieldKey, value: content.optionYes, choice: 'withWill'},
                    {key: fieldKey, value: content.optionNo, choice: 'withoutWillToggleOn'}
                ]
            };
        }

        return {
            options: [
                {key: fieldKey, value: content.optionYes, choice: 'withWill'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.isIntestacyQuestionsToggleEnabled;
        return [ctx, formdata];
    }
}

module.exports = WillLeft;
