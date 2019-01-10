'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/address/index');

module.exports = function (executorNumber) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl(parseInt(executorNumber)-1));
    I.click('.summary');
    I.fillField('#freeTextAddress', 'additional executor test address');

    I.click(commonContent.saveAndContinue);

};
