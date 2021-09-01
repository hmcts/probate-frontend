'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const pageUrl = '/other-applicants*';
const fieldKey = 'otherApplicants';
const Dashboard = require('app/steps/ui/dashboard');

class OtherApplicants extends EligibilityValidationStep {

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

        return this.next(req, ctx).constructor.getUrl('otherApplicants');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: 'optionNo', choice: 'noOthers'}
            ]
        };
    }
}

module.exports = OtherApplicants;
