'use strict';

const pageUnderTest = require('app/steps/ui/screeners/startapply/index');
const testConfig = require('test/config.js');

module.exports = function () {
    const I = this;

    if (testConfig.useIdam !== 'false') {
        I.amOnPage(pageUnderTest.getUrl());
        I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    }

    I.waitForNavigationToComplete('.button');

};
