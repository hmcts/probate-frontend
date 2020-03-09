'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/iht/method');

module.exports = function(answer) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click(`#method${answer}`);

    I.navByClick(commonContent.saveAndContinue);
};
