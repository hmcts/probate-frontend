'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/currentname');

module.exports = function(executorNumber) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl('*'));

    I.fillField('#currentName', `Executor${executorNumber} Current Name`);

    I.navByClick(commonContent.saveAndContinue);
};
