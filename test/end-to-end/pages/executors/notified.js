'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/notified/index');

module.exports = function (executorNotified, executorNumber) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl(parseInt(executorNumber) - 1));

    if (executorNotified === 'Yes') {
        I.click('#executorNotified-optionYes');
        I.persistExecutor(executorNumber, '{otherExecutorApplying}', 'but reserves power to do so at a later date. They have been notified in writing.');
    } else {
        I.click('#executorNotified-optionNo');
        I.persistExecutor(executorNumber, '{otherExecutorApplying}', 'but reserves power to do so at a later date.');
    }

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
