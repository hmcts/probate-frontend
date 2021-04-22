'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const dobContentEn = require('app/resources/en/translation/deceased/dob');
const dobContentCy = require('app/resources/cy/translation/deceased/dob');

module.exports = async function(language = 'en', day, month, year, saveAndClose = false) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const dobContent = language === 'en' ? dobContentEn : dobContentCy;

    await I.checkPageUrl('app/steps/ui/deceased/dob');
    await I.waitForText(dobContent.question, config.TestWaitForTextToAppear);
    const dobLocator = {css: '#dob-day'};
    await I.waitForElement(dobLocator);
    await I.fillField(dobLocator, day);
    await I.fillField('#dob-month', month);
    await I.fillField('#dob-year', year);

    if (saveAndClose) {
        await I.navByClick(commonContent.signOut);
    } else {
        await I.navByClick(commonContent.saveAndContinue);
    }
};
