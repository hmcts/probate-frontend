'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(day, month, year, saveAndClose = false) {
    const I = this;

    const dobLocator = {css: '#dob-day'};

    await I.waitForElement(dobLocator);
    await I.fillField(dobLocator, day);
    await I.fillField('#dob-month', month);
    await I.fillField('#dob-year', year);

    if (saveAndClose) {
        await I.navByClick('Sign out');
    } else {
        await I.navByClick(commonContent.saveAndContinue);
    }
};
