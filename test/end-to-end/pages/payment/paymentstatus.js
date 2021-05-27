'use strict';

const testConfig = require('config');

module.exports = async function(language ='en') {
    const I = this;
    const paymentStatusContent = require(`app/resources/${language}/translation/payment/status`);
    await I.checkInUrl('/payment-status');

    await I.waitForText(paymentStatusContent.question, testConfig.TestWaitForTextToAppear);
    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
