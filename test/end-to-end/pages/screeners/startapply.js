'use strict';

const testConfig = require('config');

module.exports = async function(language = 'en') {
    const I = this;
    const applyContent = require(`app/resources/${language}/translation/screeners/startapply`);

    await I.checkInUrl('/start-apply');
    await I.waitForText(applyContent.header, testConfig.TestWaitForTextToAppear);
    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
