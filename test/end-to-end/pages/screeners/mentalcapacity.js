'use strict';

const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/screeners/mentalcapacity');

module.exports = async function(answer) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/screeners/mentalcapacity');
    await I.waitForText(content.question);
    await I.see(content.hintText1);
    await I.see('You can read about');

    const locator = {css: `#mentalCapacity${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.continue);
};
