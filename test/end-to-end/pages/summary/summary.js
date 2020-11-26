'use strict';

module.exports = async function() {
    const I = this;

    const locator = {css: '#checkAnswerHref'};
    await I.waitForElement(locator);
    await I.downloadPdfIfNotIE11(locator);
    await I.navByClick('.govuk-button');
};
