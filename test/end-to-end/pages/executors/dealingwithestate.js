'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/dealingwithestate');
const {forEach} = require('lodash');

module.exports = function (executorsApplyingList, executorsDied) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    if (executorsDied) {
        forEach(executorsApplyingList, executorNumber => {
            I.checkOption('#executorsApplying-'+(parseInt(executorNumber) - 1));
        });
    } else {
        forEach(executorsApplyingList, executorNumber => {
            I.checkOption('#executorsApplying-'+(parseInt(executorNumber)));
        });
    }

    I.navByClick(commonContent.saveAndContinue);
};
