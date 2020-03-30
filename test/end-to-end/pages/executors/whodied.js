'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/whodied');

module.exports = function(executorsWhoDiedList) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    executorsWhoDiedList.forEach((executorNumber) => {
        if (executorNumber === '2') {
            I.checkOption('#executorsWhoDied');
        } else {
            I.checkOption('#executorsWhoDied-' + (parseInt(executorNumber) - 1));
        }
    });

    I.navByClick(commonContent.saveAndContinue);
};
