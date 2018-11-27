'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const content = require('app/resources/en/translation/deceased/deathcertificate');

class DeathCertificate extends ValidationStep {

    static getUrl() {
        return '/death-certificate';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('deathCertificate');
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

module.exports = DeathCertificate;
