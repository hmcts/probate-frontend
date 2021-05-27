'use strict';

module.exports = async function(language ='en', copies = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    await I.checkInUrl('/copies-overseas');
    const locator = {css: '#overseas'};
    await I.waitForElement(locator);
    await I.fillField(locator, copies);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
