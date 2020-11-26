'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(answer) {
    const I = this;

    const locator = {css: `#nameAsOnTheWill${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue);
    // I.retry({retries: 5, maxTimeout: 5000}).click(`#nameAsOnTheWill${answer}`);
    // I.retry({retries: 5, maxTimeout: 5000}).navByClick(commonContent.saveAndContinue);
};
