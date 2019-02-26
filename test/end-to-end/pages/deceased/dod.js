'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/dod/index');

module.exports = function (day, month, year, saveAndClose = false) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.fillField('#dod_day', day);
    I.fillField('#dod_month', month);
    I.fillField('#dod_year', year);

    I.persistMainApplicant('{deceasedDod}', `${parseInt(day)} ${commonContent.months.split(', ')[month-1]} ${year}`);

    if (saveAndClose) {
        //I.waitForNavigationToComplete(`a[href="${commonContent.saveAndClose}"]`);
        I.waitForNavigationToComplete('.column-two-thirds > p a');
    } else {
        I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);

    }
};
