'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/executor/index');

module.exports = function (option) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#executor-option' + option);

    I.waitForNavigationToComplete(`input[value="${commonContent.continue}"]`);

};
