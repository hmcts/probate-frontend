'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');

module.exports = async function(language ='en', copies) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;

    await I.checkPageUrl('app/steps/ui/copies/overseas');
    const locator = {css: '#overseas'};
    await I.waitForElement(locator);
    await I.fillField(locator, copies);
    await I.navByClick(commonContent.saveAndContinue);
};
