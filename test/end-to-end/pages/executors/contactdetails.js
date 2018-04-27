const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/executors/contactdetails/index');
const testConfig = require('test/config.js');

module.exports = function (executorNumber, firstRecord) {
    const I = this;

    if (firstRecord) {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    } else {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl(parseInt(executorNumber) - 1));
    }

    I.fillField('#email', testConfig.TestEnvEmailAddress);
    I.fillField('#mobile', testConfig.TestEnvMobileNumber);

    I.click(commonContent.continue);
};