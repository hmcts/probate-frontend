'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const content = require('app/resources/en/translation/deceased/deathcertificate');

class NewDeathCertificate extends ValidationStep {

    static getUrl() {
        return '/new-death-certificate';
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('deathCertificate');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'deathCertificate', value: content.optionYes, choice: 'hasCertificate'}
            ]
        };
    }

    isComplete(ctx) {
        return [ctx.deathCertificate === content.optionYes, 'inProgress'];
    }
}

module.exports = NewDeathCertificate;
