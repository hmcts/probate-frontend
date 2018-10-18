'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');

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
        return ctx;
    }

    handlePost(ctx, errors, formdata) {
        if (formdata.documents.invalid) {
            errors = errors || [];
            errors.push(FieldError('file', 'invalid', this.resourcePath, this.generateContent()));
            delete formdata.documents.invalid;
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.uploadedDocuments;
        return [ctx, formdata];
    }
}

module.exports = DocumentUpload;
