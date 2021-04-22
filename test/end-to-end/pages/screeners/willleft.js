'use strict';

const contentEn = require('app/resources/en/translation/common');
const contentCy = require('app/resources/cy/translation/common');
const willLeftEn = require('app/resources/en/translation/screeners/willleft');
const willLeftCy = require('app/resources/cy/translation/screeners/willleft');
const config = require('config');

module.exports = async function(language ='en', answer) {
    const I = this;
    const commonContent = language === 'en' ? contentEn : contentCy;
    const willLeftContent = language === 'en' ? willLeftEn : willLeftCy;

    await I.checkPageUrl('app/steps/ui/screeners/willleft');
    await I.waitForText(willLeftContent.question);
    const locator = {css: `#left${answer}`};
    await I.waitForElement(locator, config.TestWaitForElementToAppear);
    await I.click(locator);
    await I.navByClick(commonContent.continue);
};
