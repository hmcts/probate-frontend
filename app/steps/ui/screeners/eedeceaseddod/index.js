'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const pageUrl = '/ee-deceased-dod';
const fieldKey = 'eeDeceasedDod';
const Dashboard = require('app/steps/ui/dashboard');

class ExceptedEstateDeceasedDod extends EligibilityValidationStep {

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

        return this.next(req, ctx).constructor.getUrl('eeDeceasedDod');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: 'optionYes', choice: 'dodAfterEeThreshold'}
            ]
        };
    }
}

module.exports = ExceptedEstateDeceasedDod;
