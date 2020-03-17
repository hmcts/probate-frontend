'use strict';

const pageUnderTest = require('app/steps/ui/thankyou');
const thankYouContent = require('app/resources/en/translation/thankyou');
const testConfig = require('test/config.js');

module.exports = function() {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.waitForText(thankYouContent.header, testConfig.TestWaitForTextToAppear);

    I.downloadPdfIfNotIE11('#checkAnswerHref');
    I.downloadPdfIfNotIE11('#declarationPdfHref');
    I.downloadPdfIfNotIE11('#coverSheetPdfHref');

    I.click('#navigation > li:nth-child(2) > a');
};
