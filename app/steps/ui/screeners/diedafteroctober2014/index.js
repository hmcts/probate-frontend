'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const pageUrl = '/died-after-october-2014*';
const fieldKey = 'diedAfter';
const Dashboard = require('app/steps/ui/dashboard');

class DiedAfterOctober2014 extends EligibilityValidationStep {

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

        return this.next(req, ctx).constructor.getUrl('notDiedAfterOctober2014');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: 'optionYes', choice: 'diedAfter'}
            ]
        };
    }
}

module.exports = DiedAfterOctober2014;
