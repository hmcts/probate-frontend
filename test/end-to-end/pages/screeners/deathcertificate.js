'use strict';

const pageUnderTest = require('app/steps/ui/screeners/deathcertificate');

module.exports = function(answer) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());
    I.click(`#deathCertificate${answer}`);

    I.navByClick('.govuk-button');
};
