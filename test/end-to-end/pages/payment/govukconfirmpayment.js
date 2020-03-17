'use strict';

const testConfig = require('test/config');

module.exports = function() {
    const I = this;
    I.wait(3);
    I.waitForText('Payment summary', testConfig.TestWaitForTextToAppear);
    I.seeInCurrentUrl(testConfig.TestGovUkCardPaymentsUrl);
    I.waitForElement('#confirm', testConfig.TestWaitForElementToAppear);

    I.navByClick('#confirm');
};
