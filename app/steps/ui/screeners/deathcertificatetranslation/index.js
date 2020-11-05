'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const pageUrl = '/death-certificate-translation';
const fieldKey = 'deathCertificateTranslation';
const Dashboard = require('app/steps/ui/dashboard');

class DeathCertificateTranslation extends EligibilityValidationStep {

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

        return this.next(req, ctx).constructor.getUrl('deathCertificateTranslation');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: 'optionYes', choice: 'hasDeathCertificateTranslation'}
            ]
        };
    }
}

module.exports = DeathCertificateTranslation;
