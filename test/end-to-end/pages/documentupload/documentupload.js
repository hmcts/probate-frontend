'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');

module.exports = async function(language ='en', uploadDocument) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;

    await I.checkPageUrl('app/steps/ui/documentupload');
    await I.waitForVisible({css: '.document-upload__dropzone-text--choose-file'}, config.TestWaitForDocumentUpload);

    if (uploadDocument) {
        await I.uploadDocumentIfNotMicrosoftEdge();
    }

    await I.navByClick(commonContent.continue);
};
