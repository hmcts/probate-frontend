'use strict';

module.exports = async function(language = 'en', executorNumber = null, diedBefore = null, firstRecord = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    if (firstRecord) {
        // this should be refactored to not need to load the application object
        await I.checkPageUrl('app/steps/ui/executors/whendied', '*');
    } else {
        // this should be refactored to not need to load the application object
        await I.checkPageUrl('app/steps/ui/executors/whendied', parseInt(executorNumber) - 1);
    }
    const locator = {css: `#diedbefore${diedBefore}`};
    await I.waitForClickable(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
