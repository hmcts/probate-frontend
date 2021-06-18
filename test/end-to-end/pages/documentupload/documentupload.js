'use strict';

const config = require('config');

module.exports = async function(language ='en', uploadDocument = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    await I.checkInUrl('/document-upload');
    await I.waitForVisible({css: '.document-upload__dropzone-text--choose-file'}, config.TestWaitForDocumentUpload);

    if (uploadDocument) {
        await I.uploadDocumentIfNotMicrosoftEdge();
    }

    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
