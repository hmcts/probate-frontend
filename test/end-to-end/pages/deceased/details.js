'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(firstName, lastName, dob_day, dob_month, dob_year, dod_day, dod_month, dod_year) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/deceased/details');
    const locatorFn = {css: '#firstName'};
    await I.waitForElement(locatorFn);

    await I.fillField(locatorFn, firstName);
    await I.fillField({css: '#lastName'}, lastName);

    await I.fillField({css: '#dob-day'}, dob_day);
    await I.fillField({css: '#dob-month'}, dob_month);
    await I.fillField({css: '#dob-year'}, dob_year);

    await I.fillField({css: '#dod-day'}, dod_day);
    await I.fillField({css: '#dod-month'}, dod_month);
    await I.fillField({css: '#dod-year'}, dod_year);

    await I.navByClick(commonContent.saveAndContinue);
};
