'use strict';

const pageUnderTest = require('app/steps/ui/screeners/starteligibility');
const testConfig = require('test/config');

module.exports = function(checkCookieBannerExists) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    if (checkCookieBannerExists) {
        I.waitForElement('div#global-cookie-message', testConfig.TestWaitForElementToAppear);
    }

    I.navByClick('.govuk-button');
};
