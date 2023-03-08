'use strict';

module.exports = async function(language = 'en', answer = null) {
    const I = this;
    const deathCertificateContent = require(`app/resources/${language}/translation/screeners/deathcertificateinenglish`);
    const commonContent = require(`app/resources/${language}/translation/common`);
    const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');
    await I.checkInUrl('/death-certificate-english');
    await I.waitForText(await decodeHTML(deathCertificateContent.question));

    const locator = {css: `#deathCertificateInEnglish${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
