'use strict';

module.exports = async function(answer = null) {
    const I = this;
    await I.checkInUrl('/executors-alias');
    const locator = {css: `#alias${answer}`};
    await I.waitForVisible(locator);
    await I.waitForEnabled(locator);
    await I.click(locator);
    await I.click({css: '.govuk-button[data-prevent-double-click="true"]'});
};
