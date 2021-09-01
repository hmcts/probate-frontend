'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const pageUrl = '/iht-completed*';
const fieldKey = 'completed';
const Dashboard = require('app/steps/ui/dashboard');

class IhtCompleted extends EligibilityValidationStep {

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

        return this.next(req, ctx).constructor.getUrl('ihtNotCompleted');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: 'optionYes', choice: 'completed'}
            ]
        };
    }
}

module.exports = IhtCompleted;
