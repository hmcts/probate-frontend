'use strict';

const IntestacyPdf = require('./IntestacyPdf');

class IntestacyCoverSheetPdf extends IntestacyPdf {
    post(formdata) {
        const pdfTemplate = this.config.pdf.template.coverSheet;
        const body = {
            bulkScanCoverSheet: {
                applicantAddress: formdata.applicant.address,
                caseReference: formdata.ccdCase.id,
                submitAddress: formdata.registry.address
            }
        };
        const logMessage = 'Post intestacy cover sheet pdf';
        return super.post(pdfTemplate, body, logMessage);
    }
}

module.exports = IntestacyCoverSheetPdf;
