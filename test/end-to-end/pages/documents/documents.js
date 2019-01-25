'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/documents/index');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#coverSheetPdfHref');

    I.waitForNavigationToComplete(`input[value="${commonContent.continue}"]`);

};
