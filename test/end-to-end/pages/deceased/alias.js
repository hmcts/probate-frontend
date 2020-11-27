'use strict';

const config = require('config');
const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/deceased/alias');

module.exports = async function(answer) {
    const I = this;

    await I.waitForText(content.paragraph1, config.TestWaitForTextToAppear);

    const locator = {css: `#alias${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue);
};
