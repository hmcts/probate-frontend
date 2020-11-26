'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(option) {
    const I = this;

    const locator = {css: `#codicils${option}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue);
};
