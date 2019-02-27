'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/currentname/index');

module.exports = function (executorNumber, firstRecord) {
    const I = this;

    if (firstRecord) {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    } else {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl(parseInt(executorNumber) - 1));
    }

    I.fillField('#currentName', `Executor${executorNumber} Current Name`);

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
