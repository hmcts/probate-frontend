'use strict';

const commonContent = require('app/resources/en/translation/common');
const testConfig = require('config');

module.exports = function() {
    const I = this;

    I.fillField('#email', testConfig.TestEnvEmailAddress);
    I.fillField('#mobile', testConfig.TestEnvMobileNumber);

    I.navByClick(commonContent.saveAndContinue);
};
