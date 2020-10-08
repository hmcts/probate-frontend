'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const pageUrl = '/certificate-interim';

class DeathCertificateInterim extends ValidationStep {

    static getUrl() {
        return pageUrl;
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'deceasedDeathCertificate', value: 'optionDeathCertificate', choice: 'hasCertificate'}
            ]
        };
    }
}

module.exports = DeathCertificateInterim;
