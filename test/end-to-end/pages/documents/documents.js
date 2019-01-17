'use strict';

const pageUnderTest = require('app/steps/ui/documents/index');
const commonContent = require('app/resources/en/translation/common');
const documents = require('app/resources/en/translation/documents');

module.exports = function () {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click(documents.coverSheetPdf);
    I.click(commonContent.continue);
};
