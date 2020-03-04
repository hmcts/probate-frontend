'use strict';

const pageUnderTest = require('app/steps/ui/coapplicant/startpage');

module.exports = function() {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    I.navByClick('.govuk-button');
};
