'use strict';

const testConfig = require('config');

module.exports = async function(language = 'en') {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    const emailLocator = {css: '#email'};
    await I.waitForElement(emailLocator);
    await I.fillField(emailLocator, testConfig.TestEnvEmailAddress);
    await I.fillField({css: '#mobile'}, testConfig.TestEnvMobileNumber);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
