'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const pageUrl = '/foreign-death-cert-translation';

class foreignDeathCertTranslation extends ValidationStep {

    static getUrl() {
        return pageUrl;
    }
}

module.exports = foreignDeathCertTranslation;
