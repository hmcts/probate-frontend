'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const numberContentEn = require('app/resources/en/translation/executors/number');
const numberContentCy = require('app/resources/cy/translation/executors/number');

module.exports = async function (language = 'en', totalExecutors) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const numberContent = language === 'en' ? numberContentEn : numberContentCy;

    await I.checkPageUrl('app/steps/ui/executors/number');
    await I.waitForText(numberContent.checklist1Header, config.TestWaitForTextToAppear);
    const locator = {css: '#executorsNumber'};
    await I.waitForElement(locator);
    await I.fillField(locator, totalExecutors);
    await I.navByClick(commonContent.saveAndContinue);
};
