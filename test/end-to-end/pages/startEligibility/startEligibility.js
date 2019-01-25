'use strict';

//const commonContent = require('app/resources/en/translation/common');
const testConfig = require('test/config.js');
const pageUnderTest = require('app/steps/ui/starteligibility/index');

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
