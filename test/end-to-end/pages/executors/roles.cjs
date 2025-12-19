'use strict';

module.exports = async function(language = 'en', executorNumber = null, answer = null, firstRecord = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl(`/executor-roles/${firstRecord ? '*' : parseInt(executorNumber) - 1}`);
    await I.refreshPage();
    const locator = {css: `#notApplyingReason${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
