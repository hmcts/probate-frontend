'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/whendied/index');

module.exports = function (executorNumber, diedBefore, firstRecord) {
    const I = this;

    if (firstRecord) {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    } else {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl(parseInt(executorNumber) - 1));
    }

    if (diedBefore) {
        I.click('#diedbefore-optionYes');
        I.persistExecutor(executorNumber, '{otherExecutorApplying}', 'because they died before {deceasedName} died.');

    } else {
        I.click('#diedbefore-optionNo');
        I.persistExecutor(executorNumber, '{otherExecutorApplying}', 'because they died after {deceasedName} died.');
    }

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
