'use strict';

module.exports = async function(language ='en') {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    await I.checkInUrl('/documents');
    await I.downloadPdfIfNotIE11('#coverSheetPdfHref');
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
