'use strict';

const willOriginalEn = require('app/resources/en/translation/screeners/willoriginal');
const willOriginalCy = require('app/resources/cy/translation/screeners/willoriginal');
const contentEn = require('app/resources/en/translation/common');
const contentCy = require('app/resources/cy/translation/common');

module.exports = async function(language ='en', answer) {
    const I = this;
    const commonContent = language === 'en' ? contentEn : contentCy;
    const willOriginalContent = language === 'en' ? willOriginalEn : willOriginalCy;

    await I.checkPageUrl('app/steps/ui/screeners/willoriginal');
    await I.waitForText(willOriginalContent.question);

    const locator = {css: `#original${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue);
};
