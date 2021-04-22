'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');

module.exports = async function(language = 'en', executorNumber, diedBefore, firstRecord) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;

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
