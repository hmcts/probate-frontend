'use strict';

const pageUnderTest = require('app/steps/ui/signout');
const testConfig = require('config');

module.exports = async function() {
    const I = this;

    await I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    await I.waitForText('sign back in', testConfig.TestWaitForTextToAppear);

    await I.navByClick('#main-content > div > div > p:nth-child(3) > a');
};
