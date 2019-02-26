'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/declaration/index');

module.exports = function (verify) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#declarationPdfHref');
    I.click('#declarationCheckbox');

    if (verify) {
        I.selectDeclarationKeys();
        I.populateDeclarationContent();
    }

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
