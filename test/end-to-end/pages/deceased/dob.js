'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/dob');

module.exports = function(day, month, year, saveAndClose = false) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.fillField('#dob-day', day);
    I.fillField('#dob-month', month);
    I.fillField('#dob-year', year);

    if (saveAndClose) {
        I.navByClick('.column-two-thirds > p a');
    } else {
        I.navByClick(commonContent.saveAndContinue);
    }
};
