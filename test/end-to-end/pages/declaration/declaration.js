'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/declaration');

module.exports = function () {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    if (!I.isInternetExplorer()) {
        I.click('#declarationPdfHref');
    }

    I.click('#declarationCheckbox');

    I.navByClick(commonContent.saveAndContinue);
};
