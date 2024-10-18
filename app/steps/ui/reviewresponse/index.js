'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {get} = require('lodash');
const config = require('config');

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
        if (formdata.provideinformation && formdata.provideinformation.citizenResponse) {
            ctx.citizenResponse=formdata.provideinformation.citizenResponse;
        }
        if (formdata.provideinformation && formdata.provideinformation.documentUploadIssue) {
            ctx.documentUploadIssue=formdata.provideinformation.documentUploadIssue;
        }
        return ctx;
    }

    handlePost(ctx, errors, formdata, session, req) {
        if (formdata.reviewresponse && formdata.reviewresponse.citizenResponseCheckbox === 'true') {
            const document = new Document(config.services.orchestrator.url, ctx.sessionID);
            document.notifyApplicant(ctx.ccdCase.id, req.authToken, req.session.serviceAuthorization)
                .then(result => {
                    if (result.name === 'Error') {
                        throw new ReferenceError('Error sending notification about doc upload');
                    }
                });
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
        return [ctx, formdata];
    }
}

module.exports = ReviewResponse;
