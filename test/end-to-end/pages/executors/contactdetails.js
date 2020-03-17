'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/contactdetails');
const testConfig = require('config');

module.exports = (executorNumber, firstRecord) => {
    const I = this;

    if (firstRecord) {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    } else {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl(parseInt(executorNumber) - 1));
    }

    I.fillField('#email', testConfig.TestEnvEmailAddress);
    I.fillField('#mobile', testConfig.TestEnvMobileNumber);

    I.navByClick(commonContent.saveAndContinue);
};
