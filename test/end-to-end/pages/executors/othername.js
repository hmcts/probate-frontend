'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/othername');

module.exports = (executorsWithDifferentNameIdList) => {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    executorsWithDifferentNameIdList.forEach((executorListId) => {
        I.checkOption('#executorsWithOtherNames-' + executorListId);
    });

    I.navByClick(commonContent.saveAndContinue);
};
