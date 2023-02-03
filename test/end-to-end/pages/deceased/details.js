'use strict';

// fix sonarlint issue - pass params as object - max params 7
// defaulted params should be last!
module.exports = async function(language ='en', firstName = null, lastName = null,
    dob_day = null, dob_month = null, dob_year = null, dod_day = null, dod_month = null, dod_year = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/deceased-details');
    const locatorFn = {css: '#firstName'};
    await I.waitForEnabled(locatorFn);

    await I.fillField(locatorFn, firstName);
    await I.fillField({css: '#lastName'}, lastName);

    await I.fillField({css: '#dob-date-day'}, dob_day);
    await I.fillField({css: '#dob-date-month'}, dob_month);
    await I.fillField({css: '#dob-date-year'}, dob_year);

    await I.fillField({css: '#dod-date-day'}, dod_day);
    await I.fillField({css: '#dod-date-month'}, dod_month);
    await I.fillField({css: '#dod-date-year'}, dod_year);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
