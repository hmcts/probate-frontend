'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(answer) {
    const I = this;

    // locator looks suspect
    const locator = {css: `#assetsOutside ${answer}`};
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
