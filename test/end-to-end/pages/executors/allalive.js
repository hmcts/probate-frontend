'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/allalive');

module.exports = function (answer) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());
    I.click(`#allalive-option${answer}`);

    I.navByClick(commonContent.saveAndContinue);
};
