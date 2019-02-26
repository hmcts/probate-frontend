'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/name/index');

module.exports = function (firstname, lastname) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.fillField('#firstName', firstname);
    I.fillField('#lastName', lastname);

    I.persistMainApplicant('{applicantName}', `${firstname} ${lastname}`);
    I.persistMainApplicant('{applicantWillName}', `${firstname} ${lastname}`);
    I.persistMainApplicant('{applicantCurrentName}', `${firstname} ${lastname}`);

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
