'use strict';

const content = require('app/resources/en/translation/payment/status');
const testConfig = require('config');

module.exports = async function() {
    const I = this;

    await I.waitForText(content.question, testConfig.TestWaitForTextToAppear);
    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
