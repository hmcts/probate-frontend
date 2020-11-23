'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(diedBefore) {
    const I = this;

    const locator = {css: `#diedbefore${diedBefore}`};
    await I.waitForelement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
