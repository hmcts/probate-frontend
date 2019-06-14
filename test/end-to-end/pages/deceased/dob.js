'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/dob');

module.exports = function (day, month, year, saveAndClose = false) {
    const I = this;
    I.amOnLoadedPage(pageUnderTest.getUrl());

    I.fillField('#dob_day', day);
    I.fillField('#dob_month', month);
    I.fillField('#dob_year', year);

    if (saveAndClose) {
        I.navByClick('.column-two-thirds > p a');
    } else {
        I.navByClick(commonContent.saveAndContinue);
    }
};
