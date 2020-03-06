'use strict';

const pageUnderTest = require('app/steps/ui/screeners/diedafteroctober2014');

module.exports = function(answer) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());
    I.click(`#diedAfter${answer}`);

    I.navByClick('.govuk-button');
};
