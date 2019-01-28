'use strict';

const pageUnderTest = require('app/steps/ui/thankyou/index');
const thankYouContent = require('app/resources/en/translation/thankyou');

module.exports = function () {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.see(thankYouContent.header);

    I.click('#checkAnswerHref');
    I.click('#declarationPdfHref');
    I.click('#coverSheetPdfHref');

    I.click('#sign-out-header');
};
