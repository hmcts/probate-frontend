'use strict';

const pageUnderTest = require('app/steps/ui/documents/index');

module.exports = function () {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.awaitNavigation(() => I.click('#button'));
};
