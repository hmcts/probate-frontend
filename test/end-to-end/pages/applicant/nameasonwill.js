'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/nameasonwill');

module.exports = function (answer) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());
    I.click(`#nameAsOnTheWill-option${answer}`);

    I.navByClick(commonContent.saveAndContinue);
};
