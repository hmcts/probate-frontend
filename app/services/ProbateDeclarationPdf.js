'use strict';

const ProbatePdf = require('./ProbatePdf');

class ProbateDeclarationPdf extends ProbatePdf {
    post(formdata) {
        const pdfTemplate = this.config.pdf.template.declaration;
        const body = {
            legalDeclaration: formdata.legalDeclaration
        };
        const logMessage = 'Post probate declaration pdf';
        return super.post(pdfTemplate, body, logMessage);
    }
}

module.exports = ProbateDeclarationPdf;
