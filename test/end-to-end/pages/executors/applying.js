'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/applying');

module.exports = function (answer) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    I.click(`#otherExecutorsApplying-option${answer}`);

    I.navByClick(commonContent.saveAndContinue);
};
