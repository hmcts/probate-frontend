'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/iht/identifier');

module.exports = function() {
    const I = this;
    I.amOnLoadedPage(pageUnderTest.getUrl());
    I.fillField('#identifier', '123456789XXXXX');
    I.navByClick(commonContent.saveAndContinue);
};
