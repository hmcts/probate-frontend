'use strict';
/* eslint no-console: 0 no-unused-vars: 0 */
/* eslint-disable no-undef */
const pageUnderTest = require('app/steps/ui/screeners/starteligibility');
const config = require('config');

module.exports = async function(checkCookieBannerExists = false) {
    const I = this;

    await I.amOnLoadedPage(pageUnderTest.getUrl());

    if (checkCookieBannerExists) {
        await I.waitForElement('div#global-cookie-message', config.TestWaitForElementToAppear);
    }
    const locator = {css: '#main-content > div.govuk-form-group > a'};
    await I.waitForElement(locator, config.TestWaitForElementToAppear);
    await I.navByClick(locator);
};
