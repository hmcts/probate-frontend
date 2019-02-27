'use strict';

const pageUnderTest = require('app/steps/ui/coapplicant/startpage/index');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.waitForNavigationToComplete('.button');
};
