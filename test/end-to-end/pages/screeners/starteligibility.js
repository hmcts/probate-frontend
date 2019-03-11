'use strict';

const pageUnderTest = require('app/steps/ui/screeners/starteligibility/index');

module.exports = function (checkCookieBannerExists) {
    const I = this;

    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (checkCookieBannerExists) {
        I.waitForElement('div#global-cookie-message', 60);
    }

    I.waitForNavigationToComplete('.button');
};
