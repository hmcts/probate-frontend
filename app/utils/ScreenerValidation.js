'use strict';

const config = require('config');
const {get} = require('lodash');

class ScreenerValidation {

    getScreeners(journeyType, formdata) {
        const deathCertificateNotInEnglish = get(formdata, 'screeners.deathCertificateInEnglish') ? formdata.screeners.deathCertificateInEnglish === 'optionNo' : false;

        return deathCertificateNotInEnglish ? config[`${journeyType}ScreenersDeathCertificateNotInEnglish`] : config[`${journeyType}ScreenersDeathCertificateInEnglish`];
    }
}

module.exports = ScreenerValidation;
