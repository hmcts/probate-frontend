'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/screeners/otherapplicants');

module.exports = function(answer) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());
    I.click(`#otherApplicants-option${answer}`);

    I.navByClick(`input[value="${commonContent.continue}"]`);
};
