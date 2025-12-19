'use strict';

const config = require('config');

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const willLeftContent = require(`app/resources/${language}/translation/screeners/willleft`);
    const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');
    await I.checkInUrl('/will-left');

    await I.waitForText(await decodeHTML(willLeftContent.question));
    const locator = {css: `#left${answer}`};
    await I.waitForEnabled(locator, config.TestWaitForElementToAppear);
    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
