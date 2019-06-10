'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/documents');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (!I.isInternetExplorer()) {
        I.click('#coverSheetPdfHref');
    }

    I.waitForNavigationToComplete(commonContent.saveAndContinue);
};
