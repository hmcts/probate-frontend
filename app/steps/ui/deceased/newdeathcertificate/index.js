'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const content = require('app/resources/en/translation/deceased/newdeathcertificate');
const pageUrl = '/new-death-certificate';
const fieldKey = 'deathCertificate';

class NewDeathCertificate extends EligibilityValidationStep {

    static getUrl() {
        return pageUrl;
    }

    getContextData(req, res) {
        return super.getContextData(req, res, pageUrl, fieldKey);
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('deathCertificate');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: content.optionYes, choice: 'hasCertificate'}
            ]
        };
    }
}

module.exports = NewDeathCertificate;
