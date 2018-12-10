'use strict';

const Step = require('app/core/steps/Step');
const FormatCcdCaseId = require('app/utils/FormatCcdCaseId');

class ThankYou extends Step {

    static getUrl () {
        return '/thankyou';
    }

    handleGet(ctx, formdata) {
        ctx.displaySaveApplication = false;
        ctx.checkAnswersSummary = false;
        ctx.legalDeclaration = false;
        if (formdata.checkAnswersSummary) {
            ctx.checkAnswersSummary = true;
            ctx.displaySaveApplication = true;
        }
        if (formdata.legalDeclaration) {
            ctx.legalDeclaration = true;
            ctx.displaySaveApplication = true;
        }
        return [ctx];
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.ccdReferenceNumber = FormatCcdCaseId.format(req.session.form.ccdCase);
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.ccdReferenceNumber;
        return [ctx, formdata];
    }
}

module.exports = ThankYou;
