'use strict';
/* eslint no-console: 0 no-unused-vars: 0 */
/* eslint-disable no-undef */
const config = require('config');

module.exports = async function(language='en', checkCookieBannerExists = false) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    await I.amOnLoadedPage('/start-eligibility', language);

    if (checkCookieBannerExists) {
        await I.waitForElement('div#global-cookie-message', config.TestWaitForElementToAppear);
    }
    const locator = {css: '#main-content > div.govuk-form-group > a'};
    await I.waitForElement(locator, config.TestWaitForElementToAppear);
    await I.navByClick(commonContent.checkApply, {css: '.govuk-button'});
};
