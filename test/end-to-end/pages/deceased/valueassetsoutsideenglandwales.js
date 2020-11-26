'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(netAmount) {
    const I = this;

    const locator = {css: '#netValueAssetsOutsideField'};
    await I.waitForElement(locator);
    await I.fillField(locator, netAmount);

    await I.navByClick(commonContent.saveAndContinue);
};
