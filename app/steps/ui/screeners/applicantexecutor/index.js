'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const pageUrl = '/applicant-executor*';
const fieldKey = 'executor';
const Dashboard = require('app/steps/ui/dashboard');

class ApplicantExecutor extends EligibilityValidationStep {

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

        return this.next(req, ctx).constructor.getUrl('notExecutor');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: 'optionYes', choice: 'isExecutor'}
            ]
        };
    }
}

module.exports = ApplicantExecutor;
