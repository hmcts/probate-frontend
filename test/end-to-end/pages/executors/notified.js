'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(executorNotified) {
    const I = this;

    const locator = {css: `#executorNotified${executorNotified}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
