'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/alias/index');

module.exports = function (alias) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.fillField('#alias', alias);

    I.persistMainApplicant('{applicantWillName}', alias);

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
