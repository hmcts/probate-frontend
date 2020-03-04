'use strict';

const content = require('app/resources/en/translation/payment/status');
const pageUnderTest = require('app/steps/ui/payment/status');
const testConfig = require('test/config.js');

module.exports = function() {
    const I = this;

    I.waitForText(content.question, testConfig.TestWaitForTextToAppear);
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.navByClick('.govuk-button');
};
