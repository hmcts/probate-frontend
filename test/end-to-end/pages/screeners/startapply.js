'use strict';

module.exports = async function() {
    const I = this;

    const locator = {css: '.govuk-button'};
    await I.seeElement(locator);
    await I.navByClick(locator);
};
