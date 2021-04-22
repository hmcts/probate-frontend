'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const aliasContentEn = require('app/resources/en/translation/deceased/alias');
const aliasContentCy = require('app/resources/cy/translation/deceased/alias');

module.exports = async function(language = 'en', answer) {
    const I = this;

    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const aliasContent = language === 'en' ? aliasContentEn : aliasContentCy;

    await I.checkPageUrl('app/steps/ui/deceased/alias');
    await I.waitForText(aliasContent.paragraph1, config.TestWaitForTextToAppear);
    const locator = {css: `#alias${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue);
};
