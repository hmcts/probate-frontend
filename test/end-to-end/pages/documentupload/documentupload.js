'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/documentupload');
const testConfig = require('test/config');

module.exports = function () {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    I.waitForVisible('.document-upload__dropzone-text--choose-file');

    if (!I.isEdge()) {
        if (I.seeElementInDOM('.dz-hidden-input')) {
            I.waitForElement('.dz-hidden-input', testConfig.TestWaitForElementToAppear);
            I.attachFile('.dz-hidden-input', '/uploadDocuments/test_file_for_document_upload.png');
            I.waitForEnabled('#button', testConfig.TestDocumentToUpload);
        }
    }

    I.navByClick(commonContent.continue);
};
