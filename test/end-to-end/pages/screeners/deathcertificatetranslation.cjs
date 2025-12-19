'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const deathCertTranslationContent = require(`app/resources/${language}/translation/screeners/deathcertificatetranslation`);
    const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');
    await I.checkInUrl('/death-certificate-translation');
    await I.waitForText(await decodeHTML(deathCertTranslationContent.question));
    const locator = {css: `#deathCertificateTranslation${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
