'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const pageUrl = '/english-foreign-death-cert*';

class EnglishForeignDeathCert extends ValidationStep {

    static getUrl() {
        return pageUrl;
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'englishForeignDeathCert', value: 'optionYes', choice: 'foreignDeathCertIsInEnglish'}
            ]
        };
    }
}

module.exports = EnglishForeignDeathCert;
