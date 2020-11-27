'use strict';

const config = require('config');
const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/copies/uk');

module.exports = async function(copies) {
    const I = this;

    await I.waitForText(content.question, config.TestWaitForTextToAppear);
    const locator = {css: '#uk'};
    await I.waitForElement(locator);
    await I.fillField(locator, copies);

    await I.navByClick(commonContent.saveAndContinue);
};
