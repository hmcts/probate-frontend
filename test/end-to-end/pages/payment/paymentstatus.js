'use strict';

const contentEn = require('app/resources/en/translation/payment/status');
const contentCy = require('app/resources/cy/translation/payment/status');
const testConfig = require('config');

module.exports = async function(language ='en') {
    const I = this;
    const paymentStatusContent = language === 'en' ? contentEn : contentCy;
    await I.checkPageUrl('app/steps/ui/payment/status');

    await I.waitForText(paymentStatusContent.question, testConfig.TestWaitForTextToAppear);
    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
