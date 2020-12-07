'use strict';

module.exports = async function(redirect) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/summary', redirect);
    const locator = {css: '#checkAnswerHref'};
    await I.waitForElement(locator);
    await I.downloadPdfIfNotIE11(locator);
    await I.navByClick('.govuk-button');
};
