'use strict';

const deathCertificateEn = require('app/resources/en/translation/screeners/deathcertificateinenglish');
const deathCertificateCy = require('app/resources/cy/translation/screeners/deathcertificateinenglish');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');

module.exports = async function(language = 'en', answer) {
    const I = this;
    const deathCertificateContent = language === 'en' ? deathCertificateEn : deathCertificateCy;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    await I.checkPageUrl('app/steps/ui/screeners/deathcertificateinenglish');
    await I.waitForText(deathCertificateContent.question);

    const locator = {css: `#deathCertificateInEnglish${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue);
};
