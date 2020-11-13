'use strict';

const pageUnderTest = require('app/steps/ui/payment/breakdown');

module.exports = function() {
    const I = this;

    I.seeInCurrentUrl(pageUnderTest.getUrl());

    I.navByClick('.govuk-button');
};
