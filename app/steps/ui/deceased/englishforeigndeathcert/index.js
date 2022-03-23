'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const JourneyMap = require('app/core/JourneyMap');
const featureToggle = require('app/utils/FeatureToggle');
const ExceptedEstateDod = require('app/utils/ExceptedEstateDod');
const pageUrl = '/english-foreign-death-cert';

class EnglishForeignDeathCert extends ValidationStep {

    static getUrl() {
        return pageUrl;
    }

    next(req, ctx) {
        const journeyMap = new JourneyMap(req.session.journey);
        if (featureToggle.isEnabled(req.session.featureToggles, 'ft_excepted_estates') && ExceptedEstateDod.afterEeDodThreshold(ctx['dod-date']) && ctx.englishForeignDeathCert === 'optionYes') {
            return journeyMap.getNextStepByName('IhtEstateValued');
        }

        return journeyMap.nextStep(this, ctx);
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
