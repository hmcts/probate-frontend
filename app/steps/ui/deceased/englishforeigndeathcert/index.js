'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const pageUrl = '/english-foreign-death-cert';

class EnglishForeignDeathCertificate extends ValidationStep {

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

    action(ctx, formdata) {
        super.action(ctx, formdata);

        if (ctx.englishForeignDeathCert === 'optionYes') {
            ctx.foreignDeathCertTranslation = {};
        }

        return [ctx, formdata];
    }
}

module.exports = EnglishForeignDeathCertificate;
