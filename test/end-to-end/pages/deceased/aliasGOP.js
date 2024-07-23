'use strict';

const config = require('config');

module.exports = async function(language = 'en', answer = null) {
    const I = this;

    const commonContent = require(`app/resources/${language}/translation/common`);
    const aliasContent = require(`app/resources/${language}/translation/deceased/alias`);

    await I.checkInUrl('/deceased-alias');
    await I.waitForText(aliasContent.GopParagraph2, config.TestWaitForTextToAppear);
    const locator = {css: `#alias${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
