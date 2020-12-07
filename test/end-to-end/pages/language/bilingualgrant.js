'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(answer) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/language');
    const locator = {css: `#bilingual${answer}`};
    await I.waitForElement(locator);
    await I.seeCheckboxIsChecked(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
