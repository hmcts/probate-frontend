const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/executors/contactdetails/index');

module.exports = function (executorNumber, firstRecord) {
    const I = this;

    if (firstRecord) {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    } else {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl(parseInt(executorNumber) - 1));
    }

    I.fillField('#email', 'executor' + executorNumber + 'email@test.com');
    I.fillField('#mobile', '+33123456789');

    I.click(commonContent.continue);
};