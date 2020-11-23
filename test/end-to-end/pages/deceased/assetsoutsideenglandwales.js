'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = await function(answer) {
    const I = this;

    //todo - locator looks suspect
    const locator = {css: `#assetsOutside ${answer}`};
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
