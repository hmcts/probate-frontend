'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class DocumentUpload extends ValidationStep {

    static getUrl() {
        return '/document-upload';
    }
}

module.exports = DocumentUpload;
