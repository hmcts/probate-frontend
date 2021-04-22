'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const contentEn = require('app/resources/en/translation/copies/uk');
const contentCy = require('app/resources/cy/translation/copies/uk');

module.exports = async function(language = 'en', copies) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const ukCopiesContent = language === 'en' ? contentEn : contentCy;

    await I.checkPageUrl('app/steps/ui/copies/uk');
    await I.waitForText(ukCopiesContent.question, config.TestWaitForTextToAppear);
    const locator = {css: '#uk'};
    await I.waitForElement(locator);
    await I.fillField(locator, copies);

    await I.navByClick(commonContent.saveAndContinue);
};
