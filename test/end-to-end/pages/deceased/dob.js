'use strict';

const config = require('config');
const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/deceased/dob');

module.exports = async function(day, month, year, saveAndClose = false) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/deceased/dob');
    await I.waitForText(content.question, config.TestWaitForTextToAppear);
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
