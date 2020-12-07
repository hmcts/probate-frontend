'use strict';

const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/screeners/applicantexecutor');

module.exports = async function(answer) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/screeners/applicantexecutor');
    await I.waitForText(content.question);
    await I.see(content.hintText1);
    await I.see(content.hintText2);

    const locator = {css: `#executor${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.continue);
};
