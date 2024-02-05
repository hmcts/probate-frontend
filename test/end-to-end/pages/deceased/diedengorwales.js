'use strict';

const config = require('config');
module.exports = async function(language = 'en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/died-eng-or-wales');
    const locator = {css: `#diedEngOrWales${answer}`};
    await I.waitForEnabled(locator, config.TestWaitForElementToAppear);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
