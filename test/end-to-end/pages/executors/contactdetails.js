'use strict';

const commonContent = require('app/resources/en/translation/common');
const testConfig = require('config');

module.exports = async function() {
    const I = this;

    const emailLocator = {css: '#email'};
    await I.waitForElement(emailLocator);
    await I.fillField(emailLocator, testConfig.TestEnvEmailAddress);
    await I.fillField({css: '#mobile'}, testConfig.TestEnvMobileNumber);

    await I.navByClick(commonContent.saveAndContinue);
};
