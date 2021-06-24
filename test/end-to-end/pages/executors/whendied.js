'use strict';

module.exports = async function(language = 'en', executorNumber = null, diedBefore = null, firstRecord = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl(`/executor-when-died/${firstRecord ? '*' : parseInt(executorNumber) - 1}`);

    const locator = {css: `#diedbefore${diedBefore}`};
    await I.waitForEnabled(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
