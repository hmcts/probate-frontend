'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/address');

module.exports = function() {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.waitForInvisible('#addressLine1');
    I.click('.govuk-details__summary-text');
    I.waitForVisible('#addressLine1');

    I.fillField('#addressLine1', 'test address for applicant line 1');
    I.fillField('#addressLine2', 'test address for applicant line 2');
    I.fillField('#addressLine3', 'test address for applicant line 3');
    I.fillField('#postTown', 'test address for applicant town');
    I.fillField('#newPostCode', 'postcode');

    I.navByClick(commonContent.saveAndContinue);
};
