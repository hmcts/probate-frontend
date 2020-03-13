'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/whodied');

module.exports = function(executorsWhoDiedList) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    executorsWhoDiedList.forEach((executorNumber) => {
        let realExecutorNumber = parseInt(executorNumber) - 1;

        if (realExecutorNumber === 1) {
            realExecutorNumber = '';
        } else {
            realExecutorNumber *= -1;
        }

        I.checkOption(`#executorsWhoDied${realExecutorNumber}`);
    });

    I.navByClick(commonContent.saveAndContinue);
};
