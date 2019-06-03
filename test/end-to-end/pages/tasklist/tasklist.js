'use strict';

const pageUnderTest = require('app/steps/ui/tasklist');

module.exports = function () {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.waitForNavigationToComplete('.button');
};
