'use strict';

const pageUnderTest = require('app/steps/ui/screeners/startapply');

module.exports = function() {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    I.navByClick('.govuk-button');
};
