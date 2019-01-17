'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/documentupload/index');
const testConfig = require('test/config');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (I.seeElementInDOM('.dz-hidden-input')) {
        I.attachFile('.dz-hidden-input', '/uploadDocuments/test_file_for_document_upload.png');
        I.waitForEnabled('#button', testConfig.TestDocumentToUpload);
        I.waitForNavigationToComplete(`input[value="${commonContent.continue}"]`);
    } else {
        I.waitForNavigationToComplete('#input');
    }
};
