'use strict';

const pageUnderTest = require('app/steps/ui/thankyou');
const thankYouContent = require('app/resources/en/translation/thankyou');
const testConfig = require('test/config.js');

module.exports = function () {
    const I = this;

    I.amOnPage(pageUnderTest.getUrl());
    I.waitForText(thankYouContent.header, testConfig.TestWaitForTextToAppear);

    if (!I.isInternetExplorer()) {
        I.click('#checkAnswerHref');
        I.click('#declarationPdfHref');
        I.click('#coverSheetPdfHref');
    }

    I.click('#sign-out-header');
};
