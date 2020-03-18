'use strict';
/* eslint no-console: 0 no-unused-vars: 0 */
/* eslint-disable no-undef */
const pageUnderTest = require('app/steps/ui/screeners/starteligibility');
const testConfig = require('config');

module.exports = function(checkCookieBannerExists = false) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    if (checkCookieBannerExists) {
        I.waitForElement('div#global-cookie-message', testConfig.TestWaitForElementToAppear);
    }

    I.navByClick('#main-content > div.govuk-form-group > a');
};
