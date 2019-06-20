'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/othername');
const {forEach} = require('lodash');

module.exports = function (executorsWithDifferentNameIdList) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    forEach(executorsWithDifferentNameIdList, executorListId => {
        I.checkOption('#executorsWithOtherNames-'+ executorListId);
    });

    I.navByClick(commonContent.saveAndContinue);
};
