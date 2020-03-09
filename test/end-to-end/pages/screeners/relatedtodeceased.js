'use strict';

const pageUnderTest = require('app/steps/ui/screeners/relatedtodeceased');

module.exports = function(answer) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click(`#related${answer}`);

    I.navByClick('.govuk-button');
};
