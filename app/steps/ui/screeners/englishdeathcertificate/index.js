'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const pageUrl = '/english-death-certificate';
const fieldKey = 'englishDeathCertificate';
const Dashboard = require('app/steps/ui/dashboard');

class EnglishDeathCertificate extends EligibilityValidationStep {

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

        return this.next(req, ctx).constructor.getUrl('englishDeathCertificate');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: 'optionYes', choice: 'hasEnglishDeathCertificate'}
            ]
        };
    }
}

module.exports = EnglishDeathCertificate;
