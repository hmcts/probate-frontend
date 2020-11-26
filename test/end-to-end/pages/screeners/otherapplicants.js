'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(answer) {
    const I = this;

    const locator = {css: `#otherApplicants${answer}`};
    await I.seeElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.continue);
};
