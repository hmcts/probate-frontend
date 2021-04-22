'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');

module.exports = async function(language ='en') {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;

    await I.checkPageUrl('app/steps/ui/documents');
    await I.downloadPdfIfNotIE11('#coverSheetPdfHref');
    await I.navByClick(commonContent.continue);
};
