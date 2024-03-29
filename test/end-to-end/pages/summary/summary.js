'use strict';

const summaryContentEn = require('app/resources/en/translation/summary');
const summaryContentCy = require('app/resources/cy/translation/summary');

module.exports = async function(language, redirect) {
    const I = this;
    const summaryContent = language === 'en' ? summaryContentEn : summaryContentCy;

    await I.checkInUrl(`/summary/${redirect}`);
    await I.waitForText(summaryContent.heading);

    const locator = {css: '#checkAnswerHref'};
    await I.waitForElement(locator);
    await I.downloadPdfIfNotIE11(locator);
    await I.navByClick({css: '.govuk-button'});
};
