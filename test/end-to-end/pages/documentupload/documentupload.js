'use strict';

module.exports = async function(uploadDocument) {
    const I = this;

    I.waitForVisible({css: '.document-upload__dropzone-text--choose-file'});

    if (uploadDocument) {
        await I.uploadDocumentIfNotMicrosoftEdge();
    }

    await I.navByClick('.govuk-button');
};
