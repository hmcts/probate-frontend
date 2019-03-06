'use strict';

const pageUnderTest = require('app/steps/ui/declaration/index');

module.exports = async function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    const detailsOfApplicant = await this.constructApplicantDetails();
    I.persistMainApplicant('{detailsOfApplicants}', detailsOfApplicant);

    I.selectDeclarationContent();
    const declarationContent = await I.populateDeclarationContent();

    declarationContent.forEach(line => {
        I.see(line);
    });
};
