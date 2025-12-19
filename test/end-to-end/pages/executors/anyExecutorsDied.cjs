'use strict';

module.exports = async function(language = 'en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/any-executors-died');
    const locator = {css: `#anyExecutorsDied${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
