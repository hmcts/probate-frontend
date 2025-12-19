'use strict';

const config = require('config');

module.exports = async function (language = 'en', totalExecutors = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const numberContent = require(`app/resources/${language}/translation/executors/number`);

    await I.checkInUrl('/executors-number');
    await I.waitForText(numberContent.hintText, config.TestWaitForTextToAppear);
    const locator = {css: '#executorsNumber'};
    await I.waitForEnabled(locator);
    await I.fillField(locator, totalExecutors);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
