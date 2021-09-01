'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const pageUrl = '/death-certificate-english';
const fieldKey = 'deathCertificateInEnglish';
const Dashboard = require('app/steps/ui/dashboard');

class DeathCertificateInEnglish extends EligibilityValidationStep {

    static getUrl() {
        console.log('get url =>', pageUrl);
        return pageUrl;
    }

    getContextData(req, res) {
        console.log('DeathCertificateInEnglish get context data => ');
        return super.getContextData(req, res, pageUrl, fieldKey);
    }

    nextStepUrl(req, ctx) {
        console.log('DeathCertificateInEnglish nextStepUrl');
        if (!this.previousQuestionsAnswered(req, ctx, fieldKey)) {
            return Dashboard.getUrl();
        }

        return this.next(req, ctx).constructor.getUrl('deathCertificateInEnglish');
    }

    nextStepOptions() {
        console.log('nextStepOptions nextStepUrl');
        return {
            options: [
                {key: fieldKey, value: 'optionYes', choice: 'deathCertificateInEnglish'}
            ]
        };
    }
}

module.exports = DeathCertificateInEnglish;
