'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const phoneContentEn = require('app/resources/en/translation/applicant/phone');
const phoneContentCy = require('app/resources/cy/translation/applicant/phone');

module.exports = async function(language = 'en') {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const phoneContent = language === 'en' ? phoneContentEn : phoneContentCy;

    await I.checkPageUrl('app/steps/ui/applicant/phone');
    await I.waitForText(phoneContent.phoneNumber, config.TestWaitForTextToAppear);
    const locator = {css: '#phoneNumber'};
    await I.waitForElement(locator);
    await I.fillField(locator, '123456789');
    await I.navByClick(commonContent.saveAndContinue);
};
