'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/aliasreason');

module.exports = function(aliasReason, aliasOther) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click(`#aliasReason${aliasReason}`);

    if (aliasReason === '-4') {
        I.fillField('#otherReason', aliasOther);
    }

    I.navByClick(commonContent.saveAndContinue);
};
