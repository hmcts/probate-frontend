'use strict';

module.exports = async function(language ='en') {
    const I = this;
    const thankYouContent = require(`app/resources/${language}/translation/thankyou`);

    await I.checkInUrl('/thank-you');
    await I.waitForText(thankYouContent.header);

    await I.downloadPdfIfNotIE11('#checkAnswerHref');
    await I.downloadPdfIfNotIE11('#declarationPdfHref');
    await I.downloadPdfIfNotIE11('#coverSheetPdfHref');
    const locator = {css: '#navigation > li:nth-child(2) > a'};
    await I.waitForClickable(locator);
    await I.click(locator);
};
