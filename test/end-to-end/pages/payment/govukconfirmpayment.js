'use strict';

const testConfig = require('test/config');

module.exports = function () {
    const I = this;

    I.waitForText('Payment summary', testConfig.TestWaitForTextToAppear);
    I.seeInCurrentUrl(testConfig.TestGovUkConfirmPaymentUrl);
    I.waitForElement('#confirm', testConfig.TestWaitForElementToAppear);

    I.click('#confirm');
};
