'use strict';

const config = require('config');

module.exports = async function(language = 'en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const foreignDeathCertTranslationContent = require(`app/resources/${language}/translation/deceased/foreigndeathcerttranslation`);

    await I.checkInUrl('/foreign-death-cert-translation');
    await I.waitForText(foreignDeathCertTranslationContent.question, config.TestWaitForTextToAppear);

    const locator = {css: `#foreignDeathCertTranslation${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue);
};
