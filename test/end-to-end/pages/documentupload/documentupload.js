'use strict';

const pageUnderTest = require('app/steps/ui/documentupload');

module.exports = function(uploadDocument) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.waitForVisible('.document-upload__dropzone-text--choose-file');

    if (uploadDocument) {
        I.uploadDocumentIfNotMicrosoftEdge();
    }

    I.navByClick('.govuk-button');
};
