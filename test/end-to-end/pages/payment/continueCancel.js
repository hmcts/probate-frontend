'use strict';

const testConfig = require('test/config');

module.exports = function () {
    const I = this;
    I.wait(3);
    I.waitForText('Your payment has been cancelled', testConfig.TestWaitForTextToAppear);
    I.seeInCurrentUrl(testConfig.TestGovUkCardPaymentsUrl);
    I.waitForElement('#return-url', testConfig.TestWaitForElementToAppear);

    I.navByClick('#return-url');
};
