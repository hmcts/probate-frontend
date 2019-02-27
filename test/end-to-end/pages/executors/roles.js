'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/roles/index');

module.exports = function (executorNumber, powerReserved, firstRecord) {
    const I = this;

    if (firstRecord) {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    } else {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl(parseInt(executorNumber) - 1));
    }

    if (powerReserved) {
        I.click('#notApplyingReason-optionPowerReserved');
    } else {
        I.click('#notApplyingReason-optionRenunciated');
    }

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
