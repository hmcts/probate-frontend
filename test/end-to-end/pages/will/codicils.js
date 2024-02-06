'use strict';

const config = require('config');
module.exports = async function(language = 'en', option = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/will-codicils');
    const locator = {css: `#codicils${option}`};
    await I.waitForEnabled(locator, config.TestWaitForElementToAppear);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
