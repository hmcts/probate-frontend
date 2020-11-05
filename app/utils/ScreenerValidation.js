'use strict';

const config = require('config');
const featureToggle = require('app/utils/FeatureToggle');

class ScreenerValidation {

    getNewDeathCertFeatureEnabled(ftValues) {
        return featureToggle.isEnabled(ftValues, 'ft_new_deathcert_flow');
    }

    getScreeners(journeyType, formdata, ftValues) {
        //DTSPB-529 Change screeners list if new death cert FT enabled.
        if (this.getNewDeathCertFeatureEnabled(ftValues) && formdata.screeners) {
            const deathCertificateNotInEnglish = formdata.screeners.deathCertificateInEnglish ? formdata.screeners.deathCertificateInEnglish === 'optionNo' : false;

            return deathCertificateNotInEnglish ? config[`${journeyType}ScreenersDeathCertificateNotInEnglish`] : config[`${journeyType}ScreenersDeathCertificateInEnglish`];
        }

        return config[`${journeyType}Screeners`];
    }
}

module.exports = ScreenerValidation;
