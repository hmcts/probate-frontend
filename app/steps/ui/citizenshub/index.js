'use strict';

const Step = require('app/core/steps/Step');
const FormatCcdCaseId = require('app/utils/FormatCcdCaseId');
const FormatName = require('app/utils/FormatName');
const DocumentsWrapper = require('app/wrappers/Documents');
const CaseProgress = require('app/utils/CaseProgress');

class CitizensHub extends Step {

    static getUrl () {
        return '/citizens-hub';
    }

    handleGet(ctx, formdata) {
        const documentsWrapper = new DocumentsWrapper(formdata);
        ctx.documentsRequired = documentsWrapper.documentsRequired();
        ctx.checkAnswersSummary = false;
        ctx.legalDeclaration = false;
        if (formdata.legalDeclaration) {
            ctx.legalDeclaration = true;
        }
        if (formdata.checkAnswersSummary) {
            ctx.checkAnswersSummary = true;
        }
        return [ctx];
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.deceasedName = FormatName.format(req.session.form.deceased);
        ctx.grantIssued = CaseProgress.grantIssued(req.session.form.ccdCase.state);
        ctx.applicationInReview = CaseProgress.applicationInReview(req.session.form.ccdCase.state);
        ctx.documentsReceived = CaseProgress.documentsReceived(req.session.form.ccdCase.state, req.session.form.documentsReceivedNotificationSent);
        ctx.applicationSubmitted = CaseProgress.applicationSubmitted(req.session.form.ccdCase.state);
        ctx.caseStopped = CaseProgress.caseStopped(req.session.form.ccdCase.state);
        ctx.caseClosed = CaseProgress.caseClosed(req.session.form.ccdCase.state);
        ctx.ccdReferenceNumber = FormatCcdCaseId.format(req.session.form.ccdCase);
        ctx.ccdReferenceNumberAccessible = FormatCcdCaseId.formatAccessible(req.session.form.ccdCase);
        ctx.caseType = req.session.form.caseType;
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.ccdReferenceNumber;
        delete ctx.ccdReferenceNumberAccessible;
        return [ctx, formdata];
    }
}

module.exports = CitizensHub;
