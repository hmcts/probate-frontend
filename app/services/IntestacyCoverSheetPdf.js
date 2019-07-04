'use strict';

const IntestacyPdf = require('./IntestacyPdf');
const {trim, join} = require('lodash');

class IntestacyCoverSheetPdf extends IntestacyPdf {
    post(formdata) {
        const pdfTemplate = this.config.pdf.template.coverSheet;
        const body = {
            bulkScanCoverSheet: {
                applicantAddress: formdata.applicant.address.formattedAddress,
                applicantName: join([trim(formdata.applicant.firstName), trim(formdata.applicant.lastName)], ' '),
                caseReference: formdata.ccdCase.id,
                submitAddress: formdata.registry.address
            }
        };
        const logMessage = 'Post intestacy cover sheet pdf';
        return super.post(pdfTemplate, body, logMessage);
    }
}

module.exports = IntestacyCoverSheetPdf;
