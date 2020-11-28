'use strict';

module.exports = async function() {
    const I = this;

    await I.checkPageUrl('app/steps/ui/copies/summary');
    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
