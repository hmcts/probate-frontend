'use strict';

const pageUnderTest = require('app/steps/ui/screeners/mentalcapacity');

module.exports = function(answer) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click(`#mentalCapacity${answer}`);

    I.navByClick('.govuk-button');
};
