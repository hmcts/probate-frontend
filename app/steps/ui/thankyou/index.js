'use strict';

const Step = require('app/core/steps/Step');

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
        ctx.ccdReferenceNumber = '';
        if (req.session.form.ccdCase && req.session.form.ccdCase.id) {
            ctx.ccdReferenceNumber = req.session.form.ccdCase.id.toString();

            if (!ctx.ccdReferenceNumber.includes('-')) {
                ctx.ccdReferenceNumber = ctx.ccdReferenceNumber.match(/.{1,4}/g);
                ctx.ccdReferenceNumber = ctx.ccdReferenceNumber.join('-');
            }
        }
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.ccdReferenceNumber;
        return [ctx, formdata];
    }
}

module.exports = ThankYou;
