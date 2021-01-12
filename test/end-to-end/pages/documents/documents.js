'use strict';

const config = require('config');
const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/documents');

module.exports = async function() {
    const I = this;

    await I.checkPageUrl('app/steps/ui/documents');
    await I.waitForText(content.heading1, config.TestWaitForTextToAppear);
    await I.downloadPdfIfNotIE11('#coverSheetPdfHref');
    await I.navByClick(commonContent.continue);
};
