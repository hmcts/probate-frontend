'use strict';

const config = require('config');
const commonContent = require('app/resources/en/translation/common');

module.exports = async function(answer) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/applicant/nameasonwill');
    await I.waitForText('exactly what appears on the will', config.TestWaitForTextToAppear);
    const locator = {css: `#nameAsOnTheWill${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue);
    // I.retry({retries: 5, maxTimeout: 5000}).click(`#nameAsOnTheWill${answer}`);
    // I.retry({retries: 5, maxTimeout: 5000}).navByClick(commonContent.saveAndContinue);
};
