'use strict';

const pageUnderTest = require('app/steps/ui/signout');
const testConfig = require('test/config.js');

module.exports = function() {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.waitForText('sign back in', testConfig.TestWaitForTextToAppear);

    I.navByClick('#main-content > div > div > p:nth-child(3) > a');
};
