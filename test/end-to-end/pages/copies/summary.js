'use strict';


module.exports = async function() {
    const I = this;

    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
