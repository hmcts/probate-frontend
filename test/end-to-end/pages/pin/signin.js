'use strict';

module.exports = async function(pinCode) {
    const I = this;

    await I.checkInUrl('/sign-in');
    const locator = {css: '#pin'};
    await I.waitForElement(locator);
    await I.fillField(locator, pinCode);

    await I.navByClick('.govuk-button');
};
