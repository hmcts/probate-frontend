'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const pageUrl = '/death-certificate*';
const fieldKey = 'deathCertificate';
const Dashboard = require('app/steps/ui/dashboard');

class DeathCertificate extends EligibilityValidationStep {

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

        return this.next(req, ctx).constructor.getUrl('deathCertificate');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: 'optionYes', choice: 'hasCertificate'}
            ]
        };
    }
}

module.exports = DeathCertificate;
