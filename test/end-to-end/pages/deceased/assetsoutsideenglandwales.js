'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const assetsContentEn = require('app/resources/en/translation/iht/assetsoutside');
const assetsContentCy = require('app/resources/cy/translation/iht/assetsoutside');

module.exports = async function(language = 'en', answer) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const assetsContent = language === 'en' ? assetsContentEn : assetsContentCy;

    await I.checkPageUrl('app/steps/ui/iht/assetsoutside');
    await I.waitForText(assetsContent.hint, config.TestWaitForTextToAppear);
    // locator looks suspect
    const locator = {css: `#assetsOutside ${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
