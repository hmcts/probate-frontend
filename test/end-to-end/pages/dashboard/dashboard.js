'use strict';

const pageUnderTest = require('app/steps/ui/dashboard');

module.exports = function() {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.wait(3);
    I.navByClick('Continue application');

};
