'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/dod');

module.exports = function (day, month, year, saveAndClose = false) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.fillField('#dod-day', day);
    I.fillField('#dod-month', month);
    I.fillField('#dod-year', year);

    if (saveAndClose) {
        //I.waitForNavigationToComplete(`a[href="${commonContent.saveAndClose}"]`);
        I.waitForNavigationToComplete('.govuk-grid-column-two-thirds > p a');
    } else {
        I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);

    }
};
