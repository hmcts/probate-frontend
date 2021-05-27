'use strict';

// fix sonarlint issue - pass params as object - max params 7
// defaulted params should be last!
module.exports = async function(language ='en', firstName = null, lastName = null,
    dob_day = null, dob_month = null, dob_year = null, dod_day = null, dod_month = null, dod_year = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/deceased-details');
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

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
