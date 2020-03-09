'use strict';

const commonContent = require('app/resources/en/translation/common');
const documentsContent = require('app/resources/en/translation/documents');
const pageUnderTest = require('app/steps/ui/documents');

module.exports = function(paperForm, deathCertUploaded, renouncing) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (paperForm) {
        I.see(documentsContent['checklist-item4-iht205']);
    }
    if (!deathCertUploaded) {
        I.see(documentsContent['checklist-item3-will-uploaded']);
    }
    if (renouncing) {
        const renouncingContent = 'filled in by the spouse or civil partner of the deceased who is permanently giving up the right to make this application for probate';
        I.see(renouncingContent);
    }

    I.downloadPdfIfNotIE11('#coverSheetPdfHref');

    I.navByClick(commonContent.continue);
};
