'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/roles');

module.exports = function (executorNumber, powerReserved, firstRecord) {
    const I = this;

    if (firstRecord) {
        I.amOnLoadedPage(pageUnderTest.getUrl());
    } else {
        I.amOnLoadedPage(pageUnderTest.getUrl(parseInt(executorNumber) - 1));
    }

    if (powerReserved) {
        I.click('#notApplyingReason-optionPowerReserved');
    } else {
        I.click('#notApplyingReason-optionRenunciated');
    }

    I.navByClick(commonContent.saveAndContinue);
};
