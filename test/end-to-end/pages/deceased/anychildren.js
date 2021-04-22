'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const childrenContentEn = require('app/resources/en/translation/deceased/anychildren');
const childrenContentCy = require('app/resources/cy/translation/deceased/anychildren');

module.exports = async function (language = 'en', answer) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const childrenContent = language === 'en' ? childrenContentEn : childrenContentCy;

    await I.checkPageUrl('app/steps/ui/deceased/anychildren');
    await I.waitForText(childrenContent.hint, config.TestWaitForTextToAppear);
    const locator = `#anyChildren${answer}`;
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue);
};
