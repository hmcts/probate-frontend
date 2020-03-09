'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/declaration');

module.exports = function(bilingualGOP) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (bilingualGOP) {
        I.downloadPdfIfNotIE11('#declarationPdfHref-cy');
    }

    I.downloadPdfIfNotIE11('#declarationPdfHref-en');
    I.click('#declarationCheckbox');

    I.navByClick(commonContent.saveAndContinue);
};
