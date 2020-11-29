'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(executorNumber, diedBefore, firstRecord) {
    const I = this;

    if (firstRecord) {
        await I.checkPageUrl('app/steps/ui/executors/whendied', '*');
    } else {
        await I.checkPageUrl('app/steps/ui/executors/whendied', parseInt(executorNumber) - 1);
    }
    const locator = {css: `#diedbefore${diedBefore}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
