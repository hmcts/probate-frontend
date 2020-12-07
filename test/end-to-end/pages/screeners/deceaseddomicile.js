'use strict';

const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/screeners/deceaseddomicile');

module.exports = async function(answer) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/screeners/deceaseddomicile');
    await I.waitForText(content.question);
    await I.see(content.hintText1);
    await I.seeElement({css: '#domicile-hint'});
    await I.see('You can read more about ');

    const locator = {css: `#domicile${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.continue);
};
