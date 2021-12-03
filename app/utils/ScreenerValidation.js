'use strict';

const config = require('config');
const {get} = require('lodash');
const featureToggle = require('app/utils/FeatureToggle');

class ScreenerValidation {

    getScreeners(journeyType, formdata, featureToggles) {
        let exceptedEstates = '';
        if (featureToggle.isEnabled(featureToggles, 'ft_excepted_estates')) {
            exceptedEstates = 'ExceptedEstates';
        }
        const deathCertificateNotInEnglish = get(formdata, 'screeners.deathCertificateInEnglish') ? formdata.screeners.deathCertificateInEnglish === 'optionNo' : false;

        return deathCertificateNotInEnglish ? config[`${journeyType}ScreenersDeathCertificateNotInEnglish${exceptedEstates}`] : config[`${journeyType}ScreenersDeathCertificateInEnglish${exceptedEstates}`];
    }
}

module.exports = ScreenerValidation;
