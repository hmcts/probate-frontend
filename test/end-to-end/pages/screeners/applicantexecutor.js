'use strict';

const pageUnderTest = require('app/steps/ui/screeners/applicantexecutor');

module.exports = function(answer) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());
    I.click(`#executor${answer}`);

    I.navByClick('.govuk-button');
};
