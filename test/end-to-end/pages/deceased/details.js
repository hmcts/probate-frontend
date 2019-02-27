'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/details/index');

module.exports = function (firstName, lastName, dob_day, dob_month, dob_year, dod_day, dod_month, dod_year) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.fillField('#firstName', firstName);
    I.fillField('#lastName', lastName);

    I.fillField('#dob_day', dob_day);
    I.fillField('#dob_month', dob_month);
    I.fillField('#dob_year', dob_year);

    I.fillField('#dod_day', dod_day);
    I.fillField('#dod_month', dod_month);
    I.fillField('#dod_year', dod_year);

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
