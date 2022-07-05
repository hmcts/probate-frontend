'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const pageUrl = '/deceased-domicile';
const fieldKey = 'domicile';
const Dashboard = require('app/steps/ui/dashboard');
const ExceptedEstateDeceasedDod = require('app/steps/ui/screeners/eedeceaseddod');
const featureToggle = require('app/utils/FeatureToggle');

class DeceasedDomicile extends EligibilityValidationStep {

    static getUrl() {
        return pageUrl;
    }

    getContextData(req, res) {
        return super.getContextData(req, res, pageUrl, fieldKey);
    }

    nextStepUrl(req, ctx) {
        if (!this.previousQuestionsAnswered(req, ctx, fieldKey)) {
            return Dashboard.getUrl();
        }

        if (featureToggle.isEnabled(req.session.featureToggles, 'ft_excepted_estates') && ctx.domicile === 'optionYes') {
            return ExceptedEstateDeceasedDod.getUrl();
        }

        return this.next(req, ctx).constructor.getUrl('notInEnglandOrWales');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: 'optionYes', choice: 'inEnglandOrWales'}
            ]
        };
    }
}

module.exports = DeceasedDomicile;
