'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/whodied');

module.exports = (executorsWhoDiedList) => {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    executorsWhoDiedList.forEach((executorNumber) => {
        I.checkOption('#executorsWhoDied-'+(parseInt(executorNumber) - 1));
    });

    I.navByClick(commonContent.saveAndContinue);
};
