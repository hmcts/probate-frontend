'use strict';

const testConfig = require('config');

module.exports = async function(language = 'en') {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const paymentContent = require(`app/resources/${language}/translation/payment/breakdown`);

    await I.checkInUrl('/payment-breakdown');
    // replace with explicit wait for some html content
    await I.wait(3);
    await I.waitForText(paymentContent.applicationFee, testConfig.TestWaitForTextToAppear);
    await I.waitForText(commonContent.payAndSubmitApplication, testConfig.TestWaitForTextToAppear);
    await I.navByClick(commonContent.payAndSubmitApplication, 'button.govuk-button');
};
