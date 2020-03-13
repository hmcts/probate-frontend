'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/contactdetails');
const testConfig = require('test/config');

module.exports = function(executorNumber, firstRecord) {
    const I = this;

    if (firstRecord) {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl('*'));
    } else {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl(2));
    }

    I.fillField('#email', testConfig.TestEnvEmailAddress);
    I.fillField('#mobile', testConfig.TestEnvMobileNumber);

    I.navByClick(commonContent.saveAndContinue);
};
