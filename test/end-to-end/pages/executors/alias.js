'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/alias');

module.exports = function() {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    I.click('#alias-optionYes');

    I.navByClick(commonContent.saveAndContinue);
};
