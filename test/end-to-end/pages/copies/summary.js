'use strict';

const config = require('config');

module.exports = async function(language ='en') {
    const I = this;
    const summaryContent = require(`app/resources/${language}/translation/copies/summary`);
    await I.checkInUrl('/copies-summary');
    await I.waitForText(summaryContent.extraCopies, config.TestWaitForTextToAppear);

    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
