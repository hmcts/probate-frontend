'use strict';

const pageUnderTest = require('app/steps/ui/coapplicant/agreepage');

module.exports = function() {
    const I = this;

    I.retry(5).seeCurrentUrlEquals(pageUnderTest.getUrl());
};
