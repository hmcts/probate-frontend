'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(copies) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/copies/overseas');
    const locator = {css: '#overseas'};
    await I.waitForElement(locator);
    await I.fillField(locator, copies);

    await I.navByClick(commonContent.saveAndContinue);
};
