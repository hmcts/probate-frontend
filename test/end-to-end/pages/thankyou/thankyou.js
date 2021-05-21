'use strict';

const thankYouContentEn = require('app/resources/en/translation/thankyou');
const thankYouContentCy = require('app/resources/cy/translation/thankyou');

module.exports = async function(language ='en') {
    const I = this;
    const thankYouContent = language === 'en' ? thankYouContentEn : thankYouContentCy;

    await I.checkPageUrl('app/steps/ui/thankyou');
    await I.waitForText(thankYouContent.header);

    await I.downloadPdfIfNotIE11('#checkAnswerHref');
    await I.downloadPdfIfNotIE11('#declarationPdfHref');
    await I.downloadPdfIfNotIE11('#coverSheetPdfHref');
    const locator = {css: '#navigation > li:nth-child(2) > a'};
    await I.waitForElement(locator);
    await I.click(locator);
};
