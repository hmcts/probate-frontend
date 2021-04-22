'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const childrenContentEn = 'have any other children?';
const childrenContentCy = 'blant eraill?';

module.exports = async function (language = 'en', answer) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const childrenContent = language === 'en' ? childrenContentEn : childrenContentCy;

    await I.checkPageUrl('app/steps/ui/deceased/anyotherchildren');
    await I.waitForText(childrenContent, config.TestWaitForTextToAppear);
    const locator = {css: `#anyOtherChildren${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue);
};
