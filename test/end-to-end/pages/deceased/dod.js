'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const dodContentEn = require('app/resources/en/translation/deceased/dod');
const dodContentCy = require('app/resources/cy/translation/deceased/dod');

module.exports = async function(language = 'en', day, month, year) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const dodContent = language === 'en' ? dodContentEn : dodContentCy;

    await I.checkPageUrl('app/steps/ui/deceased/dod');
    await I.waitForText(dodContent.question, config.TestWaitForTextToAppear);
    const dodDayLocator = {css: '#dod-day'};
    await I.waitForElement(dodDayLocator);
    await I.fillField(dodDayLocator, day);
    await I.fillField({css: '#dod-month'}, month);
    await I.fillField({css: '#dod-year'}, year);

    await I.navByClick(commonContent.saveAndContinue);
};
