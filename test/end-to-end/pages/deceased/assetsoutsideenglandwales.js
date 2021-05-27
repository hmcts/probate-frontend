'use strict';

const config = require('config');

module.exports = async function(language = 'en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const assetsContent = require(`app/resources/${language}/translation/iht/assetsoutside`);

    await I.checkInUrl('/assets-outside-england-wales');
    await I.waitForText(assetsContent.hint, config.TestWaitForTextToAppear);
    const locator = {css: `#assetsOutside ${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
