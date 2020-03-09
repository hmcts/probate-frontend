'use strict';

const pageUnderTest = require('app/steps/ui/screeners/otherapplicants');

module.exports = function(answer) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click(`#otherApplicants${answer}`);

    I.navByClick('.govuk-button');
};
