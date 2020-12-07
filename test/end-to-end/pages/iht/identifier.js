'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function() {
    const I = this;

    await I.checkPageUrl('app/steps/ui/iht/identifier');
    const locator = {css: '#identifier'};

    await I.waitForElement(locator);
    await I.fillField(locator, '123456789XXXXX');
    await I.navByClick(commonContent.saveAndContinue);
};
