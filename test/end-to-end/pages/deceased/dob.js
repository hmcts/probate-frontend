'use strict';

const config = require('config');

module.exports = async function(language = 'en', day = null, month = null, year= null, saveAndClose = false) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const dobContent = require(`app/resources/${language}/translation/deceased/dob`);

    await I.checkInUrl('/deceased-dob');
    await I.waitForText(dobContent.question, config.TestWaitForTextToAppear);
    const dobLocator = {css: '#dob-day'};
    await I.waitForEnabled(dobLocator);
    await I.fillField(dobLocator, day);
    await I.fillField('#dob-month', month);
    await I.fillField('#dob-year', year);

    if (saveAndClose) {
        await I.navByClick(commonContent.signOut);
    } else {
        await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
    }
};
