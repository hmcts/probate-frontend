'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/dealingwithestate/index');
const {forEach} = require('lodash');

module.exports = function (executorsApplyingList) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    forEach(executorsApplyingList, executorNumber => {
        I.checkOption('#executorsApplying-'+(parseInt(executorNumber) - 1));
    });

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);

};
