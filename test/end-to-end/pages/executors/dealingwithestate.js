'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/dealingwithestate');
const {forEach} = require('lodash');

module.exports = function (executorsApplyingList) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    forEach(executorsApplyingList, executorNumber => {
        I.checkOption('#executorsApplying-'+(parseInt(executorNumber) - 1));
    });

    I.navByClick(commonContent.saveAndContinue);
};
