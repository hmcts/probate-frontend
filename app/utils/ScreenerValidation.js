'use strict';

const config = require('config');
const {get} = require('lodash');
const featureToggle = require('app/utils/FeatureToggle');

class ScreenerValidation {

    getScreeners(journeyType, formdata, featureToggles) {
        return config[this.eligibilityListBuilder(journeyType, formdata, featureToggles)];
    }

    eligibilityListBuilder(journeyType, formdata, featureToggles) {
        const deathCertificateNotInEnglish = get(formdata, 'screeners.deathCertificateInEnglish') ? formdata.screeners.deathCertificateInEnglish === 'optionNo' : false;

        let eligibilityListString = deathCertificateNotInEnglish ? journeyType + 'ScreenersDeathCertificateNotInEnglish' : journeyType + 'ScreenersDeathCertificateInEnglish';

        if (featureToggle.isEnabled(featureToggles, 'ft_excepted_estates')) {
            const dodBeforeEeThreshold = get(formdata, 'screeners.eeDeceasedDod') ? formdata.screeners.eeDeceasedDod === 'optionNo' : false;

            if (dodBeforeEeThreshold) {
                eligibilityListString += 'DodBeforeThreshold';
            }

            eligibilityListString += 'ExceptedEstates';
        }

        return eligibilityListString;
    }
}

module.exports = ScreenerValidation;
