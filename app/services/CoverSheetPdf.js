'use strict';

const Pdf = require('./Pdf');
const FormatName = require('app/utils/FormatName');
const RegistryWrapper = require('app/wrappers/Registry');

class CoverSheetPdf extends Pdf {

    post(req) {
        const pdfTemplate = this.config.pdf.template.coverSheet;
        const formdata = req.session.form;
        const registryAddress = (new RegistryWrapper(formdata.registry)).address();
        const body = {
            applicantAddress: formdata.applicant.address.formattedAddress,
            applicantName: FormatName.format(formdata.applicant),
            caseReference: formdata.ccdCase.id,
            submitAddress: registryAddress
        };
        const logMessage = 'Post cover sheet pdf';
        return super.post(pdfTemplate, body, logMessage, req);
    }
}

module.exports = CoverSheetPdf;
