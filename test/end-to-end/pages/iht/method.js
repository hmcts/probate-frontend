'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const contentEn = require('app/resources/en/translation/iht/method');
const contentCy = require('app/resources/cy/translation/iht/method');

module.exports = async function(language = 'en', answer) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const ihtContent = language === 'en' ? contentEn : contentCy;

    await I.checkPageUrl('app/steps/ui/iht/method');
    await I.waitForText(ihtContent.question, config.TestWaitForTextToAppear);

    const locator = {css: `#method${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
