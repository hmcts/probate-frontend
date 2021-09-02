'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const pageUrl = '/death-certificate';
const fieldKey = 'deathCertificate';
const Dashboard = require('app/steps/ui/dashboard');

class DeathCertificate extends EligibilityValidationStep {

    static getUrl() {
        console.log('death certificate get url => ', pageUrl);
        return pageUrl;
    }

    getContextData(req, res) {
        return super.getContextData(req, res, pageUrl, fieldKey);
    }

    nextStepUrl(req, ctx) {
        console.log('DeathCertificate nextStepUrl => ');
        // console.log('ctx => ', ctx);
        if (!this.previousQuestionsAnswered(req, ctx, fieldKey)) {
            return Dashboard.getUrl();
        }
        console.log('next url => ', this.next(req, ctx).constructor.getUrl('deathCertificate'));

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
