'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/aliasreason/index');

module.exports = function (aliasReason, aliasOther) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click(`#${aliasReason}`);

    if (aliasOther) {
        I.fillField('#otherReason', aliasOther);
    }

    I.click(commonContent.continue);
};
