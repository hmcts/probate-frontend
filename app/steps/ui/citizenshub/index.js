'use strict';

const Step = require('app/core/steps/Step');
const FormatCcdCaseId = require('app/utils/FormatCcdCaseId');
const FormatName = require('app/utils/FormatName');
const DocumentsWrapper = require('app/wrappers/Documents');
const CaseProgress = require('app/utils/CaseProgress');
const moment = require('moment');
const utils = require('app/components/step-utils');

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
        const state = req.session.form.ccdCase.state;
        ctx.deceasedName = FormatName.format(req.session.form.deceased);
        ctx.grantIssued = CaseProgress.grantIssued(state);
        ctx.applicationInReview = CaseProgress.applicationInReview(state);
        ctx.documentsReceived = CaseProgress.documentsReceived(state, req.session.form.documentsReceivedNotificationSent);
        ctx.applicationSubmitted = CaseProgress.applicationSubmitted(state);
        ctx.caseStopped = CaseProgress.caseStopped(state, req.session.form.citizenResponseSubmittedDate);
        ctx.caseClosed = CaseProgress.caseClosed(state);
        ctx.ccdReferenceNumber = FormatCcdCaseId.format(req.session.form.ccdCase);
        ctx.ccdReferenceNumberAccessible = FormatCcdCaseId.formatAccessible(req.session.form.ccdCase);
        ctx.caseType = req.session.form.caseType;
        ctx.informationNeededByPost=req.session.form.informationNeededByPost;
        ctx.informationNeeded=req.session.form.informationNeeded;
        if (req.session.form.citizenResponseSubmittedDate) {
            ctx.date = utils.formattedDate(moment(req.session.form.citizenResponseSubmittedDate, 'YYYY-MM-DD').parseZone(), req.session.language);
        }
        ctx.informationProvided = CaseProgress.informationProvided(state, req.session.form.provideinformation?.documentUploadIssue, req.session.form.citizenResponseSubmittedDate);
        ctx.partialInformationProvided = CaseProgress.partialInformationProvided(state, req.session.form.provideinformation?.documentUploadIssue, req.session.form.citizenResponseSubmittedDate);
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
