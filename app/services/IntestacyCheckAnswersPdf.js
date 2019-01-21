'use strict';

const IntestacyPdf = require('./IntestacyPdf');

class IntestacyCheckAnswersPdf extends IntestacyPdf {
    post(formdata) {
        const pdfTemplate = this.config.pdf.template.checkAnswers;
        const body = {
            checkAnswersSummary: formdata.checkAnswersSummary
        };
        const logMessage = 'Post intestacy check answers pdf';
        return super.post(pdfTemplate, body, logMessage);
    }
}

module.exports = IntestacyCheckAnswersPdf;
