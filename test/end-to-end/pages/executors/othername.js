'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/othername');
const {forEach} = require('lodash');

module.exports = function (executorsApplyingList, executorsWithDifferentNameList) {
    const I = this;
    let executorId;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    forEach(executorsWithDifferentNameList, executorNumber => {
        executorId = executorsApplyingList.indexOf(executorNumber)+1;
        I.checkOption('#executorsWithOtherNames-'+ executorId);
    });

    I.navByClick(commonContent.saveAndContinue);
};
