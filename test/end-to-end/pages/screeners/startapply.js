'use strict';

const pageUnderTest = require('app/steps/ui/screeners/startapply');

module.exports = function () {
    const I = this;

    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.waitForNavigationToComplete('.button');

};
