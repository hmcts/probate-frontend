'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/currentname');

module.exports = async function(executorNumber) {
    const I = this;

    await I.seeCurrentUrlEquals(pageUnderTest.getUrl('*'));

    await I.fillField('#currentName', `Executor${executorNumber} Current Name`);

    await I.navByClick(commonContent.saveAndContinue);
};
