'use strict';
const deathCertTranslationEn = require('app/resources/en/translation/screeners/deathcertificatetranslation');
const deathCertTranslationCy = require('app/resources/cy/translation/screeners/deathcertificatetranslation');
const contentEn = require('app/resources/en/translation/common');
const contentCy = require('app/resources/cy/translation/common');

module.exports = async function(language ='en', answer) {
    const I = this;
    const commonContent = language === 'en' ? contentEn : contentCy;
    const deathCertTranslationContent = language === 'en' ? deathCertTranslationEn : deathCertTranslationCy;

    await I.waitForText(deathCertTranslationContent.question);
    await I.checkPageUrl('app/steps/ui/screeners/deathcertificatetranslation');
    const locator = {css: `#deathCertificateTranslation${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue);
};
