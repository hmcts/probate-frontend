'use strict';

const content = require('app/resources/en/translation/tasklist');
const testConfig = require('config');

module.exports = async function () {
    const I = this;

    await I.checkPageUrl('app/steps/ui/tasklist');

    await I.waitForText(content.introduction, testConfig.TestWaitForTextToAppear);
    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    await I.click(locator);
};
