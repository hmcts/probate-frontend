'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const deathCertTranslationContent = require(`app/resources/${language}/translation/screeners/deathcertificatetranslation`);

    await I.checkInUrl('/death-certificate-translation');
    await I.waitForText(deathCertTranslationContent.question);
    const locator = {css: `#deathCertificateTranslation${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
