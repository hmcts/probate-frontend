'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/applying');

module.exports = function () {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    I.click('#otherExecutorsApplying-optionYes');

    I.navByClick(commonContent.saveAndContinue);
};
