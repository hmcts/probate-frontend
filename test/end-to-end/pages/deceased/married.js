'use strict';

const config = require('config');
const commonContent = require('app/resources/en/translation/common');

module.exports = async function(answer) {
    const I = this;

    await I.waitForText('get married or enter into a civil partnership', config.TestWaitForTextToAppear);
    const locator = {css: `#married${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
