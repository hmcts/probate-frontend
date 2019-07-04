'use strict';

const ProbatePdf = require('./ProbatePdf');
const {trim, join} = require('lodash');

class ProbateCoverSheetPdf extends ProbatePdf {
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
        const logMessage = 'Post probate cover sheet pdf';
        return super.post(pdfTemplate, body, logMessage);
    }
}

module.exports = ProbateCoverSheetPdf;
