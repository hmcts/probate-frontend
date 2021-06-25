'use strict';

const testConfig = require('config');

module.exports = async function(language = 'en') {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const paymentContent = require(`app/resources/${language}/translation/payment/breakdown`);

    await I.checkInUrl('/payment-breakdown');
    await I.waitForText(paymentContent.applicationFee, testConfig.TestWaitForTextToAppear);
    await I.waitForText(commonContent.saveAndClose, testConfig.TestWaitForTextToAppear);
    await I.navByClick(commonContent.saveAndClose);
};
