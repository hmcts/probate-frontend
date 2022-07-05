'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const pageUrl = '/foreign-death-cert-translation';
const JourneyMap = require('app/core/JourneyMap');
const featureToggle = require('app/utils/FeatureToggle');
const ExceptedEstateDod = require('app/utils/ExceptedEstateDod');

class ForeignDeathCertTranslation extends ValidationStep {

    static getUrl() {
        return pageUrl;
    }

    next(req, ctx) {
        const journeyMap = new JourneyMap(req.session.journey);
        if (featureToggle.isEnabled(req.session.featureToggles, 'ft_excepted_estates') && ExceptedEstateDod.afterEeDodThreshold(ctx['dod-date'])) {
            return journeyMap.getNextStepByName('IhtEstateValued');
        }

        return journeyMap.nextStep(this, ctx);
    }
}

module.exports = ForeignDeathCertTranslation;
