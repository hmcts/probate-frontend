'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/documentupload');
const testConfig = require('test/config');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click('.document-upload__dropzone-text--choose-file');

    I.uploadDocument();

    if (!I.isEdge()) {
        if (I.seeElementInDOM('.dz-hidden-input')) {
            I.waitForElement('.dz-hidden-input', 60);
            I.attachFile('.dz-hidden-input', '/uploadDocuments/test_file_for_document_upload.png');
            I.waitForEnabled('#button', testConfig.TestDocumentToUpload);
            I.waitForNavigationToComplete(commonContent.continue);
        } else {
            I.waitForNavigationToComplete('#input');
        }
    }
};
