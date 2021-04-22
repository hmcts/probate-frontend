'use strict';

const applyContentEn = require('app/resources/en/translation/screeners/startapply');
const applyContentCy = require('app/resources/cy/translation/screeners/startapply');
const testConfig = require('config');

module.exports = async function(language = 'en') {
    const I = this;
    const applyContent = language === 'en' ? applyContentEn : applyContentCy;

    await I.checkPageUrl('app/steps/ui/screeners/startapply');
    await I.waitForText(applyContent.header, testConfig.TestWaitForTextToAppear);
    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
