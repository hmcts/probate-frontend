'use strict';

const content = require('app/resources/en/translation/tasklist');
const testConfig = require('config');

module.exports = async function () {
    const I = this;

    try {
        await I.checkPageUrl('app/steps/ui/tasklist');
    } catch (e) {
        const url = await I.grabCurrentUrl();
        console.info(`tasklist url: ${url}`);
        console.error(e.message);
        throw e;
    }

    await I.waitForText(content.introduction, testConfig.TestWaitForTextToAppear);
    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    await I.click(locator);
};
