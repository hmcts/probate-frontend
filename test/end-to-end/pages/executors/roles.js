'use strict';

module.exports = async function(language = 'en', executorNumber = null, answer = null, firstRecord = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    if (firstRecord) {
        // this should be refactored to not need to load the application object
        await I.checkPageUrl('app/steps/ui/executors/roles', '*');
    } else {
        // this should be refactored to not need to load the application object
        await I.checkPageUrl('app/steps/ui/executors/roles', parseInt(executorNumber) - 1);
    }

    const locator = {css: `#notApplyingReason${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue);
};
