'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/address');
const testConfig = require('test/config');

module.exports = function () {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());
    I.waitForInvisible('#addressLine1', testConfig.TestWaitForElementToAppear);
    I.click('.summary');
    I.waitForVisible('#addressLine1', testConfig.TestWaitForElementToAppear);

    I.fillField('#addressLine1', 'test address for deceased line 1');
    I.fillField('#addressLine2', 'test address for deceased line 2');
    I.fillField('#addressLine3', 'test address for deceased line 3');
    I.fillField('#postTown', 'test address for deceased town');
    I.fillField('#newPostCode', 'postcode');

    I.navByClick(commonContent.saveAndContinue);

};
