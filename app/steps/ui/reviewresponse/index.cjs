'use strict';

const ValidationStep = require('app/core/steps/ValidationStep.cjs');
const Document = require('app/services/Document.cjs');
const {get} = require('lodash');
const config = require('config');
const {addWeeksToDate} = require('app/utils/FormatDate.cjs');

class ReviewResponse extends ValidationStep {

    static getUrl() {
        return '/review-response';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        if (formdata.documents?.uploads) {
            ctx.uploadedDocuments = formdata.documents.uploads.map(doc => doc.filename);
        }
        if (formdata.provideinformation?.citizenResponse) {
            ctx.citizenResponse=formdata.provideinformation.citizenResponse;
        }
        if (formdata.provideinformation?.documentUploadIssue) {
            ctx.documentUploadIssue=formdata.provideinformation.documentUploadIssue;
        }
        return ctx;
    }

    handlePost(ctx, errors, formdata, session) {
        if (ctx.citizenResponseCheckbox === 'true') {
            const document = new Document(config.services.orchestrator.url, ctx.sessionID);
            document.notifyApplicant(ctx.ccdCase.id, ctx.citizenResponseCheckbox, session.authToken, session.serviceAuthorization)
                .then(result => {
                    if (result.name === 'Error') {
                        throw new ReferenceError('Error sending notification about doc upload');
                    }
                });
            ctx.expectedResponseDate = addWeeksToDate(new Date().toISOString()
                .slice(0, 10), 7);
        }
        return [ctx, errors];
    }

    isComplete(ctx, formdata) {
        return [get(formdata, 'reviewresponse.citizenResponseCheckbox') === 'true', 'inProgress'];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.uploadedDocuments;
        delete ctx.citizenResponse;
        delete ctx.informationNeededByPost;
        delete ctx.informationNeeded;
        delete formdata.informationNeededByPost;
        delete formdata.informationNeeded;
        return [ctx, formdata];
    }

    shouldPersistFormData() {
        return false;
    }
}

module.exports = ReviewResponse;
