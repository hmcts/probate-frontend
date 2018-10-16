'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class DocumentUpload extends ValidationStep {

    static getUrl() {
        return '/document-upload';
    }

    handleGet(ctx, formdata) {
        if (formdata.documents) {
            ctx.uploadedFiles = formdata.documents.uploads;
        }

        return [ctx];
    }
}

module.exports = DocumentUpload;
