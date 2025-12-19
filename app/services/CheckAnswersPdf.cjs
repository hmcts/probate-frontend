'use strict';

const Pdf = require('./Pdf.cjs');

class CheckAnswersPdf extends Pdf {

    post(req) {
        const pdfTemplate = this.config.pdf.template.checkAnswers;
        const logMessage = 'Post probate check answers pdf';
        return super.post(pdfTemplate, req.session.form.checkAnswersSummary, logMessage, req);
    }
}

module.exports = CheckAnswersPdf;
