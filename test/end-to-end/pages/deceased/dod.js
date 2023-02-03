'use strict';

const config = require('config');

module.exports = async function(language = 'en', day = null, month = null, year = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const dodContent = require(`app/resources/${language}/translation/deceased/dod`);

    await I.checkInUrl('/deceased-dod');
    await I.waitForText(dodContent.question, config.TestWaitForTextToAppear);
    const dodDayLocator = {css: '#dod-date-day'};
    await I.waitForEnabled(dodDayLocator);
    await I.fillField(dodDayLocator, day);
    await I.fillField({css: '#dod-date-month'}, month);
    await I.fillField({css: '#dod-date-year'}, year);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
