'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(answer) {
    const I = this;

    const locator = {css: `#bilingual${answer}`};
    await I.waitForElement(locator);
    await I.seeCheckboxIsChecked(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
