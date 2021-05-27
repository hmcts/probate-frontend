'use strict';

const summaryContentEn = require('app/resources/en/translation/summary');
const summaryContentCy = require('app/resources/cy/translation/summary');

module.exports = async function(language = 'en', redirect = null) {
    const I = this;
    const summaryContent = language === 'en' ? summaryContentEn : summaryContentCy;

    // this should be refactored to not need to load the application object
    await I.checkPageUrl('app/steps/ui/summary', redirect);
    await I.waitForText(summaryContent.heading);

    const locator = {css: '#checkAnswerHref'};
    await I.waitForElement(locator);
    await I.downloadPdfIfNotIE11(locator);
    await I.navByClick('.govuk-button');
};
