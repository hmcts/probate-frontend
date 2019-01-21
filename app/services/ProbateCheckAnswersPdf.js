'use strict';

const ProbatePdf = require('./ProbatePdf');

class ProbateCheckAnswersPdf extends ProbatePdf {
    post(formdata) {
        const pdfTemplate = this.config.pdf.template.checkAnswers;
        const body = {
            checkAnswersSummary: formdata.checkAnswersSummary
        };
        const logMessage = 'Post probate check answers pdf';
        return super.post(pdfTemplate, body, logMessage);
    }
}

module.exports = ProbateCheckAnswersPdf;
