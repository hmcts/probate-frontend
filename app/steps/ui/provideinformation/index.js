'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');

class ProvideInformation extends ValidationStep {

    static getUrl() {
        return '/provide-information';
    }

    getContextData(req) {
        console.log('ProvideInformation.getContextData.............');
        let ctx = super.getContextData(req);
        ctx = this.pruneFormData(req.body, ctx);
        const formdata = req.session.form;
        if (formdata.documents?.uploads) {
            ctx.uploadedDocuments = formdata.documents.uploads.map(doc => doc.filename);
        }
        ctx.isUploadingDocument = req.body?.isUploadingDocument;
        return ctx;
    }

    pruneFormData(body, ctx) {
        if (body && Object.keys(body).length > 0 && !Object.keys(body).includes('documentUploadIssue')) {
            delete ctx.documentUploadIssue;
        }
        return ctx;
    }
    handlePost(ctx, errors, formdata, session) {
        if ((ctx.citizenResponse==='' || typeof ctx.citizenResponse==='undefined') &&
            (!ctx.documentUploadIssue || typeof ctx.documentUploadIssue==='undefined') &&
            (typeof ctx.uploadedDocuments ==='undefined' || ctx.uploadedDocuments.length === 0)
        ) {
            errors.push(FieldError('citizenResponse', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        const error = formdata.documents?.error;
        if (error) {
            errors = errors || [];
            errors.push(FieldError('file', error, this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            delete formdata.documents.error;
        }
        if (typeof ctx.documentUploadIssue==='undefined' || !ctx.documentUploadIssue) {
            ctx.documentUploadIssue = 'false';
        }
        return [ctx, errors];
    }

    isComplete(ctx) {
        return [(typeof ctx.uploadedDocuments !== 'undefined') || (typeof ctx.citizenResponse !== 'undefined') ||
        (typeof ctx.documentUploadIssue !== 'undefined'), 'inProgress'];
    }

    nextStepOptions(ctx) {
        ctx.responseOrDocument = typeof ctx.citizenResponse !== 'undefined' || typeof ctx.uploadedDocuments !== 'undefined';
        return {
            options: [
                {key: 'responseOrDocument', value: true, choice: 'responseOrDocument'},
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

module.exports = ProvideInformation;
