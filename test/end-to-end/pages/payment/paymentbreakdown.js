'use strict';

module.exports = async function() {
    const I = this;

    await I.waitForElement({css: 'form[action="/payment-breakdown"]'});
    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);

    await I.navByClick(locator);
};
