'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(copies) {
    const I = this;

    const locator = {css: '#uk'};
    await I.waitForElement(locator);
    await I.fillField(locator, copies);

    await I.navByClick(commonContent.saveAndContinue);
};
