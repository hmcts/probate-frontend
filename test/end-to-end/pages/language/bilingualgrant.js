'use strict';

const config = require('config');
module.exports = async function(language = 'en', answer) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/bilingual-gop');
    const locator = {css: `#bilingual${answer}`};
    await I.waitForEnabled(locator, config.TestWaitForElementToAppear);
    await I.seeCheckboxIsChecked(locator);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
