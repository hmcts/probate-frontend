'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/relationshiptodeceased');

module.exports = (answer) => {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());
    I.click(`#relationshipToDeceased-option${answer}`);
    I.navByClick(commonContent.saveAndContinue);
};
