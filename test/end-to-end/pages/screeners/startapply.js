'use strict';
const content = require('app/resources/en/translation/screeners/startapply');

module.exports = async function() {
    const I = this;

    await I.checkPageUrl('app/steps/ui/screeners/startapply');
    await I.waitForText(content.header);
    // can't use html encoded text to compare.  await I.see(content.introduction);
    await I.see('Based on the information you’ve given, you have everything you need to make your application for probate online.');
    await I.see(content.paragraph1);
    // can't use html encoded text to compare. await I.see(content.paragraph2);
    await I.see('You must use your own email address even if someone helps with your application. That’s because we can’t discuss details with anyone but the person making the application.');

    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
