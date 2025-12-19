'use strict';

const Pdf = require('./Pdf.cjs');
const FormatName = require('app/utils/FormatName.cjs');
const RegistryWrapper = require('app/wrappers/Registry.cjs');
const DocumentPageUtil = require('app/utils/DocumentPageUtil.cjs');

class CoverSheetPdf extends Pdf {

    post(req) {
        const pdfTemplate = this.config.pdf.template.coverSheet;
        const formdata = req.session.form;
        const registryAddress = (new RegistryWrapper(formdata.registry)).address();
        const body = {
            applicantAddress: formdata.applicant.address.formattedAddress,
            applicantName: FormatName.format(formdata.applicant),
            caseReference: formdata.ccdCase.id,
            submitAddress: registryAddress,
            checkListItems: DocumentPageUtil.getCheckListItemsCoversheet(formdata, req.session.language),
            noDocumentsRequired: DocumentPageUtil.noDocsRequired(formdata),
            noDocumentsRequiredText: DocumentPageUtil.getNoDocsRequiredText(formdata, req.session.language)
        };
        const logMessage = 'Post cover sheet pdf';
        return super.post(pdfTemplate, body, logMessage, req);
    }
}

module.exports = CoverSheetPdf;
