'use strict';

const testConfig = require('config');

// eslint-disable-next-line no-unused-vars
module.exports = async function(language = 'en') {
    const I = this;

    const emailLocator = {css: '#email'};
    await I.waitForEnabled(emailLocator);
    await I.refreshPage();
    await I.fillField(emailLocator, testConfig.TestEnvEmailAddress);
    await I.fillField({css: '#mobile'}, testConfig.TestEnvMobileNumber);
    await I.click({css: '.govuk-button[data-prevent-double-click="true"]'});
};
