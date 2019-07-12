'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/anychildren');

module.exports = function (answer) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());
    I.click(`#anyChildren-option${answer}`);

    I.navByClick(commonContent.saveAndContinue);
};
