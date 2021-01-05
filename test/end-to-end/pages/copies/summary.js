'use strict';

const config = require('config');
const content = require('app/resources/en/translation/copies/summary');

module.exports = async function() {
    const I = this;

    await I.checkPageUrl('app/steps/ui/copies/summary');
    await I.waitForText(content.extraCopies, config.TestWaitForTextToAppear);
    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
