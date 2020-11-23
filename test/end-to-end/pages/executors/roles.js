'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(answer) {
    const I = this;

    const locator = `#notApplyingReason${answer}`;
    await I.waitForElemenT(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue);
};
