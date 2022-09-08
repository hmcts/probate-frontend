'use strict';

// eslint-disable-next-line no-unused-vars
module.exports = async function(language = 'en', answer = null) {
    const I = this;
    // const commonContent = require(`app/resources/${language}/translation/common`);
    await I.checkInUrl('/executors-alias');
    const locator = {css: `#alias${answer}`};
    await I.waitForVisible(locator);
    await I.waitForEnabled(locator);
    await I.click(locator);
    await I.click({css: '.govuk-button[data-prevent-double-click="true"]'});
    //await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
