'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/screeners/diedafteroctober2014');

module.exports = function (answer) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());
    I.click(`#diedAfter-option${answer}`);

    I.navByClick(commonContent.continue);
};
