'use strict';

const config = require('config');

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const willLeftContent = require(`app/resources/${language}/translation/screeners/willleft`);

    await I.checkInUrl('/will-left');
    await I.waitForText(willLeftContent.question);
    const locator = {css: `#left${answer}`};
    await I.waitForClickable(locator, config.TestWaitForElementToAppear);
    await I.click(locator);
    await I.navByClick(commonContent.continue);
};
