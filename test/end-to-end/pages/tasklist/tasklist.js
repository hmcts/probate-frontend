'use strict';

const content = require('app/resources/en/translation/tasklist');
const pageUnderTest = require('app/steps/ui/tasklist');
const testConfig = require('test/config.js');

module.exports = function () {
    const I = this;
    I.waitForText(content.introduction, testConfig.TestWaitForTextToAppear);
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click('.govuk-button');
};
