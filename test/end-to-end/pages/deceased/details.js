'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/details');

module.exports = function(firstName, lastName, dob_day, dob_month, dob_year, dod_day, dod_month, dod_year) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.fillField('#firstName', firstName);
    I.fillField('#lastName', lastName);

    I.fillField('#dob-day', dob_day);
    I.fillField('#dob-month', dob_month);
    I.fillField('#dob-year', dob_year);

    I.fillField('#dod-day', dod_day);
    I.fillField('#dod-month', dod_month);
    I.fillField('#dod-year', dod_year);

    I.navByClick(commonContent.saveAndContinue);
};
