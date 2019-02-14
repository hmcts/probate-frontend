'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/dealingwithestate/index');
const {forEach} = require('lodash');

module.exports = function (executorsApplyingList, executorsDied) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    if (executorsDied) {
        forEach(executorsApplyingList, executorNumber => {
            I.click('#executorsApplying-'+(parseInt(executorNumber)-1));
        });
    } else {
        forEach(executorsApplyingList, executorNumber => {
            I.click('#executorsApplying-'+(parseInt(executorNumber)));
        });
    }

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
