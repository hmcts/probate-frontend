'use strict';

const pageUnderTest = require('app/steps/ui/screeners/ihtcompleted');

module.exports = function(answer) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click(`#completed${answer}`);

    I.navByClick('.govuk-button');
};
