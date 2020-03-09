'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/documentupload');

module.exports = function(uploadDocument) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.waitForVisible('.document-upload__dropzone-text--choose-file');

    if (uploadDocument) {
        I.uploadDocumentIfNotMicrosoftEdge();
    }

    I.navByClick(commonContent.continue);
};
