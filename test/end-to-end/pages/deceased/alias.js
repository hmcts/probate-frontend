'use strict';

const config = require('config');

module.exports = async function(language = 'en', answer = null) {
    const I = this;

    const commonContent = require(`app/resources/${language}/translation/common`);
    const aliasContent = require(`app/resources/${language}/translation/deceased/alias`);

    await I.checkInUrl('/deceased-alias');
    await I.waitForText(aliasContent.paragraph1, config.TestWaitForTextToAppear);
    const locator = {css: `#alias${answer}`};
    await I.waitForClickable(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue);
};
