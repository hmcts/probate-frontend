'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/anychildren');

module.exports = function (answer) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click(`#anyChildren${answer}`);

    I.navByClick(commonContent.saveAndContinue);
};
