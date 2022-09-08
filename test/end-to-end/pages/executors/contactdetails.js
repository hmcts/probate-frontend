'use strict';

const testConfig = require('config');

// eslint-disable-next-line no-unused-vars
module.exports = async function(language = 'en') {
    const I = this;
    // const commonContent = require(`app/resources/${language}/translation/common`);

    const emailLocator = {css: '#email'};
    await I.waitForEnabled(emailLocator);
    await I.refreshPage();
    // await I.waitForEnabled(emailLocator);
    await I.fillField(emailLocator, testConfig.TestEnvEmailAddress);
    await I.fillField({css: '#mobile'}, testConfig.TestEnvMobileNumber);
    await I.click({css: '.govuk-button[data-prevent-double-click="true"]'});
    //await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
