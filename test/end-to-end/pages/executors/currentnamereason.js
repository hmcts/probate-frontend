'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/currentnamereason/index');

module.exports = function (executorNumber, aliasReason, aliasOther) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl(parseInt(executorNumber)-1));
    I.click(`#${aliasReason}`);

    if (aliasOther) {
        I.fillField('#otherReason', aliasOther);
    }

    I.persistExecutor(executorNumber, '{aliasReason}', ' '+aliasOther || ' '+aliasReason);

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
