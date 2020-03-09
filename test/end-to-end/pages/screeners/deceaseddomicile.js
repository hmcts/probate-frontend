'use strict';

const pageUnderTest = require('app/steps/ui/screeners/deceaseddomicile');

module.exports = function(answer) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click(`#domicile${answer}`);

    I.navByClick('.govuk-button');
};
