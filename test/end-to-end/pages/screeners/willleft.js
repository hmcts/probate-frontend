'use strict';

const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/screeners/willleft');
const config = require('config');

module.exports = async function(answer) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/screeners/willleft');
    await I.waitForText(content.question);
    const locator = {css: `#left${answer}`};
    await I.waitForVisible(locator, config.TestWaitForElementToAppear);
    await I.click(locator);
    await I.navByClick(commonContent.continue);
};
