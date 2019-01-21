'use strict';

const IntestacyPdf = require('./IntestacyPdf');

class IntestacyDeclarationPdf extends IntestacyPdf {
    post(formdata) {
        const pdfTemplate = this.config.pdf.template.declaration;
        const body = {
            legalDeclaration: formdata.legalDeclaration
        };
        const logMessage = 'Post intestacy declaration pdf';
        return super.post(pdfTemplate, body, logMessage);
    }
}

module.exports = IntestacyDeclarationPdf;
