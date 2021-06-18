'use strict';

const config = require('config');

module.exports = async function(language = 'en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const ihtContent = require(`app/resources/${language}/translation/iht/method`);

    await I.checkInUrl('/iht-method');
    await I.waitForText(ihtContent.question, config.TestWaitForTextToAppear);

    const locator = {css: `#method${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
