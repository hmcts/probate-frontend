'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/dealingwithestate');

module.exports = function(executorsApplyingList) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    executorsApplyingList.forEach((executorNumber) => {
        let realExecutorNumber = parseInt(executorNumber) - 1;

        if (realExecutorNumber === 1) {
            realExecutorNumber = '';
        } else {
            realExecutorNumber *= -1;
        }
        I.checkOption(`#executorsApplying${realExecutorNumber}`);
    });

    I.navByClick(commonContent.saveAndContinue);
};
