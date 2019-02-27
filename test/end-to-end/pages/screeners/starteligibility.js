'use strict';

const pageUnderTest = require('app/steps/ui/screeners/starteligibility/index');
const testConfig = require('test/config.js');

module.exports = function (checkCookieBannerExists) {
    const I = this;

    if (testConfig.useIdam !== 'false') {
        I.amOnPage(pageUnderTest.getUrl());
        I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    }

    if (checkCookieBannerExists) {
        I.waitForElement('div#global-cookie-message', 60);
    }

    I.waitForNavigationToComplete('.button');
};
