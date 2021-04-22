'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const testConfig = require('config');

module.exports = async function(language = 'en') {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;

    const emailLocator = {css: '#email'};
    await I.waitForElement(emailLocator);
    await I.fillField(emailLocator, testConfig.TestEnvEmailAddress);
    await I.fillField({css: '#mobile'}, testConfig.TestEnvMobileNumber);

    await I.navByClick(commonContent.saveAndContinue);
};
