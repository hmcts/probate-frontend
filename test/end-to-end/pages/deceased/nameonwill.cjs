'use strict';

const config = require('config');

module.exports = async function(language = 'en', answer = null) {
    const I = this;

    const commonContent = require(`app/resources/${language}/translation/common`);
    const aliasContent = require(`app/resources/${language}/translation/deceased/nameasonwill`);

    await I.checkInUrl('/deceased-name-as-on-will');
    await I.waitForText(aliasContent.explanation1, config.TestWaitForTextToAppear);
    const locator = {css: `#nameAsOnTheWill${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
