'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/names/index');

module.exports = function (totalExecutors) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    let i = 0;

    while (i < (totalExecutors-1)) {
        I.fillField('#executorName_'+i, 'exec'+(i+2));
        i += 1;
    }

    I.intialiseExecutors(totalExecutors-1, true);

    for (let i = 0; i < totalExecutors-1; i++) {
        const executorId = i + 2;
        const name = 'exec' + executorId;
        I.persistExecutor(i, 'executorNumber', executorId, true);
        I.persistExecutor(executorId, '{applicantWillName}', name);
        I.persistExecutor(executorId, '{applicantNameOnWill}', name);
        I.persistExecutor(executorId, '{applicantCurrentName}', name);
        I.persistExecutor(executorId, '{otherExecutorName}', name);
    }

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
