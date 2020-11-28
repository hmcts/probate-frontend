'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(diedBefore) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/executors/whendied');
    const locator = {css: `#diedbefore${diedBefore}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
