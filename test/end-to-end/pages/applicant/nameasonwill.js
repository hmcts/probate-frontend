'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/nameasonwill');

module.exports = function(answer) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.retry({retries: 5, maxTimeout: 5000}).click(`#nameAsOnTheWill${answer}`);

    I.retry({retries: 5, maxTimeout: 5000}).navByClick(commonContent.saveAndContinue);
};
