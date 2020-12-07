'use strict';

const config = require('config');

module.exports = async function(uploadDocument) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/documentupload');
    await I.waitForVisible({css: '.document-upload__dropzone-text--choose-file'}, config.TestWaitForDocumentUpload);

    if (uploadDocument) {
        await I.uploadDocumentIfNotMicrosoftEdge();
    }

    await I.navByClick('.govuk-button');
};
