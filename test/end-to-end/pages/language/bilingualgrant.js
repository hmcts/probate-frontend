'use strict';

const pageUnderTest = require('app/steps/ui/language');
const commonContent = require('app/resources/en/translation/common');

module.exports = function() {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.seeCheckboxIsChecked('#bilingual-2');

    I.navByClick(commonContent.saveAndContinue);
};
