'use strict';

module.exports = async function(language = 'en', hmrcCode = null) {
    const I = this;
    const locatorGv = {css: '#uniqueProbateCodeId'};
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/unique-probate-code');
    await I.waitForEnabled (locatorGv);
    await I.fillField(locatorGv, hmrcCode);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
