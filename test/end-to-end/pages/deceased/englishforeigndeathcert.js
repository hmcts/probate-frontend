'use strict';

const config = require('config');

module.exports = async function(language = 'en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const englishForeignDeathCertContent = require(`app/resources/${language}/translation/deceased/englishforeigndeathcert`);

    await I.checkInUrl('/english-foreign-death-cert');
    await I.waitForText(englishForeignDeathCertContent.question, config.TestWaitForTextToAppear);

    const locator = `#englishForeignDeathCert${answer}`;
    await I.waitForEnabled(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
