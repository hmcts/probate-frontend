'use strict';

const config = require('config');
const {get} = require('lodash');
const featureToggle = require('app/utils/FeatureToggle');

class ScreenerValidation {

    getScreeners(journeyType, formdata, featureToggles) {
        return config[this.eligibilityListBuilder(journeyType, formdata, featureToggles)];
    }

    eligibilityListBuilder(journeyType, formdata, featureToggles) {
        let eligibilityListString = journeyType + 'Screeners';
        const deathCertificateNotInEnglish = get(formdata, 'screeners.deathCertificateInEnglish') ? formdata.screeners.deathCertificateInEnglish === 'optionNo' : false;

        eligibilityListString = deathCertificateNotInEnglish ? eligibilityListString += 'DeathCertificateNotInEnglish' : eligibilityListString += 'DeathCertificateInEnglish';

        if (featureToggle.isEnabled(featureToggles, 'ft_excepted_estates')) {
            const exceptedEstates = 'ExceptedEstates';
            const dodBeforeEeThreshold = get(formdata, 'screeners.eeDeceasedDod') ? formdata.screeners.eeDeceasedDod === 'optionNo' : false;

            eligibilityListString = dodBeforeEeThreshold ? eligibilityListString += `DodBeforeThreshold${exceptedEstates}` : eligibilityListString += exceptedEstates;
        }

        return eligibilityListString;
    }
}

module.exports = ScreenerValidation;
