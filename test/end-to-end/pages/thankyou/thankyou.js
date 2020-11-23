'use strict';

const thankYouContent = require('app/resources/en/translation/thankyou');

module.exports = async function() {
    const I = this;

    await I.waitForText(thankYouContent.header);

    await I.downloadPdfIfNotIE11('#checkAnswerHref');
    await I.downloadPdfIfNotIE11('#declarationPdfHref');
    await I.downloadPdfIfNotIE11('#coverSheetPdfHref');
    const locator = {css: '#navigation > li:nth-child(2) > a'};
    await I.waitForElement(locator);
    await I.click(locator);
};
