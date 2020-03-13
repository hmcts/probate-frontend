'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/othername');

module.exports = function(executorsWithDifferentNameIdList) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    executorsWithDifferentNameIdList.forEach((executorListId) => {
        const realExecutorNumber = parseInt(executorListId) * -1;

        I.checkOption(`#executorsWithOtherNames${realExecutorNumber}`);
    });

    I.navByClick(commonContent.saveAndContinue);
};
