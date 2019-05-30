'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const {get, set} = require('lodash');

class DocumentUpload extends ValidationStep {

    static getUrl() {
        return '/document-upload';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        if (formdata.documents && formdata.documents.uploads) {
            ctx.uploadedDocuments = formdata.documents.uploads.map(doc => doc.filename);
        }
        ctx.isUploadingDocument = req.body && req.body.isUploadingDocument;
        return ctx;
    }

    handlePost(ctx, errors, formdata) {
        const error = formdata.documents && formdata.documents.error;
        if (error) {
            errors = errors || [];
            errors.push(FieldError('file', error, this.resourcePath, this.generateContent()));
            delete formdata.documents.error;
        } else {
            set(formdata, 'documentUploadComplete', true);
        }
        return [ctx, errors];
    }

    isComplete(ctx, formdata) {
        return [typeof get(formdata, 'documentUploadComplete') !== 'undefined', 'inProgress'];
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'isUploadingDocument', value: 'true', choice: 'isUploadingDocument'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.uploadedDocuments;
        delete ctx.isUploadingDocument;
        return [ctx, formdata];
    }
}

module.exports = DocumentUpload;
