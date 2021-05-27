'use strict';

const config = require('config');

module.exports = async function(language = 'en', day = null, month = null, year = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const dodContent = require(`app/resources/${language}/translation/deceased/dod`);

    await I.checkInUrl('/deceased-dod');
    await I.waitForText(dodContent.question, config.TestWaitForTextToAppear);
    const dodDayLocator = {css: '#dod-day'};
    await I.waitForElement(dodDayLocator);
    await I.fillField(dodDayLocator, day);
    await I.fillField({css: '#dod-month'}, month);
    await I.fillField({css: '#dod-year'}, year);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
