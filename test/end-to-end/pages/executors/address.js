'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/address');

module.exports = function(executor) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl(executor));

    I.enterAddress();

    I.navByClick(commonContent.saveAndContinue);
};
