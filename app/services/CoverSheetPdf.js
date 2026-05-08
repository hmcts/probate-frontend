'use strict';

const Pdf = require('./Pdf');
const FormatName = require('app/utils/FormatName');
const RegistryWrapper = require('app/wrappers/Registry');
const DocumentPageUtil = require('app/utils/DocumentPageUtil');

class CoverSheetPdf extends Pdf {

    post(req) {
        const pdfTemplate = this.config.pdf.template.coverSheet;
        const formdata = req.session.form;
        const registryAddress = (new RegistryWrapper(formdata.registry)).address();
        const body = {
            isBilingual: formdata.language.bilingual === 'optionYes',
            applicantAddress: formdata.applicant.address.formattedAddress,
            applicantName: FormatName.format(formdata.applicant),
            caseReference: formdata.ccdCase.id,
            submitAddress: registryAddress,
            checkListItems: DocumentPageUtil.getCheckListItemsCoversheet(formdata, 'en'),
            checkListItemsWelsh: DocumentPageUtil.getCheckListItemsCoversheet(formdata, 'cy'),
            noDocumentsRequired: DocumentPageUtil.noDocsRequired(formdata),
            noDocumentsRequiredText: DocumentPageUtil.getNoDocsRequiredText(formdata, 'en'),
            noDocumentsRequiredTextWelsh: DocumentPageUtil.getNoDocsRequiredText(formdata, 'cy')
        };
        const logMessage = 'Post cover sheet pdf';
        return super.post(pdfTemplate, body, logMessage, req);
    }
}

module.exports = CoverSheetPdf;
