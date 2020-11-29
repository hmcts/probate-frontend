'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(executorNumber, answer, firstRecord) {
    const I = this;

    if (firstRecord) {
        await I.checkPageUrl('app/steps/ui/executors/roles', '*');
    } else {
        await I.checkPageUrl('app/steps/ui/executors/roles', parseInt(executorNumber) - 1);
    }

    const locator = {css: `#notApplyingReason${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue);
};
