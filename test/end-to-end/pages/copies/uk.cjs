'use strict';

const config = require('config');

module.exports = async function(language = 'en', copies = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const ukCopiesContent = require(`app/resources/${language}/translation/copies/uk`);

    await I.checkInUrl('/copies-uk');
    await I.waitForText(ukCopiesContent.question, config.TestWaitForTextToAppear);
    const locator = {css: '#uk'};
    await I.waitForEnabled(locator);
    await I.fillField(locator, copies);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
