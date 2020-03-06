'use strict';

const pageUnderTest = require('app/steps/ui/screeners/willoriginal');

module.exports = function(answer) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());
    I.click(`#original${answer}`);

    I.navByClick('.govuk-button');
};
