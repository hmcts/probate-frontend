'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const pageUrl = '/foreign-death-cert-translation';
const JourneyMap = require('app/core/JourneyMap');
const featureToggle = require('app/utils/FeatureToggle');
const ExceptedEstateDod = require('app/utils/ExceptedEstateDod');
const {isEmpty} = require('lodash');

class ForeignDeathCertTranslation extends ValidationStep {

    static getUrl() {
        return pageUrl;
    }
    next(req, ctx) {
        const journeyMap = new JourneyMap(req.session.journey);
        const formData = req.session.form;
        const ihtToggle = featureToggle.isEnabled(req.session.featureToggles, 'ft_stop_ihtonline');
        const checkData = isEmpty(formData.iht) || (formData.iht.method === 'optionOnline' && isEmpty(formData.iht.identifier));
        const withPaper = ihtToggle && formData.iht && formData.iht.method === 'optionPaper';
        if (featureToggle.isEnabled(req.session.featureToggles, 'ft_excepted_estates') && ExceptedEstateDod.afterEeDodThreshold(ctx['dod-date'])) {
            return journeyMap.getNextStepByName('HmrcCheck');
        } else if (featureToggle.isEnabled(req.session.featureToggles, 'ft_stop_ihtonline') && checkData) {
            formData.iht = {method: 'optionPaper'};
            return journeyMap.getNextStepByName('IhtPaper');
        } else if (withPaper) {
            return journeyMap.getNextStepByName('IhtPaper');
        }
        return journeyMap.nextStep(this, ctx);
    }
}

module.exports = ForeignDeathCertTranslation;
