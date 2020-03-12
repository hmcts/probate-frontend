'use strict';

const testConfig = require('config');

module.exports = () => {
    const I = this;

    I.waitForText('Payment summary', testConfig.TestWaitForTextToAppear);
    I.seeInCurrentUrl(testConfig.TestGovUkConfirmPaymentUrl);
    I.waitForElement('#confirm', testConfig.TestWaitForElementToAppear);

    I.click('#confirm');
};
