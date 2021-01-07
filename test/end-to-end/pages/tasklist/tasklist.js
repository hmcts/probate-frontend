'use strict';

module.exports = async function () {
    const I = this;

    await I.checkPageUrl('app/steps/ui/tasklist');
    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    await I.click(locator);
};
