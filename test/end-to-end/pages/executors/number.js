'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function (totalExecutors) {
    const I = this;

    const locator = {css: '#executorsNumber'};
    await I.waitForElement(locator);
    await I.fillField(locator, totalExecutors);

    await I.navByClick(commonContent.saveAndContinue);
};
