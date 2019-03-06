'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/declaration/index');

module.exports = async function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.selectDeclarationContent();
    const declarationContent = await I.populateDeclarationContent();
    await Promise.all([
        declarationContent.forEach(line => {
            I.see(line);
        })
    ]);
    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);

};
