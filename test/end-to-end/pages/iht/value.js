'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/iht/value');

module.exports = function(grossValue, netValue) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.fillField('#grossValueField', grossValue);
    I.fillField('#netValueField', netValue);

    I.navByClick(commonContent.saveAndContinue);
};
