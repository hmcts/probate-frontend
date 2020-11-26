'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(answer) {
    const I = this;

    await I.waitForText('Did the person who died leave a will?');

    const locator = {css: `#left${answer}`};
    await I.seeElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue);
};
