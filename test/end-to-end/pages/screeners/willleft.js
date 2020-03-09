'use strict';

const pageUnderTest = require('app/steps/ui/screeners/willleft');

module.exports = function(answer) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click(`#left${answer}`);

    I.navByClick('.govuk-button');
};
