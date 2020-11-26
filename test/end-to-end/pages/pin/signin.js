'use strict';

module.exports = async function(pinCode) {
    const I = this;

    const locator = {css: '#pin'};
    await I.waitForElement(locator);
    await I.fillField(locator, pinCode);

    await I.navByClick('.govuk-button');
};
