'use strict';

const fileType = require('file-type');
const config = require('app/config').documentUpload;
const content = require('app/resources/en/translation/common');

class DocumentUpload {
    initDocuments(formdata) {
        if (!formdata.documents) {
            formdata.documents = {};
        }
        return formdata;
    }

    addDocument(uploadedDocument, uploads = []) {
        if (uploadedDocument.originalname) {
            uploads.push({
                filename: uploadedDocument.originalname
            });
        }
        return uploads;
    }

    removeDocument(index, uploads = []) {
        if (!isNaN(index) && uploads.length > 0) {
            uploads.splice(index, 1);
        }
        return uploads;
    }

    isValidType(document) {
        if (!document) {
            return false;
        }

        const validMimeTypes = config.validMimeTypes;

        if (!validMimeTypes.includes(document.mimetype)) {
            return false;
        }

        const uploadedDocumentType = fileType(document.buffer);

        if (!uploadedDocumentType) {
            return false;
        }

        return validMimeTypes.includes(uploadedDocumentType.mime);
    }

    isValidSize(document) {
        return document.size <= config.maxSizeBytes;
    }

    isValidNumber(uploads = []) {
        return uploads.length < config.maxFiles;
    }

    validate(document, uploads) {
        let error = null;

        if (error === null && !this.isValidType(document)) {
            error = {
                js: content.documentUploadInvalidFileType,
                nonJs: 'type'
            };
        }

        if (error === null && !this.isValidSize(document)) {
            error = {
                js: content.documentUploadMaxSize,
                nonJs: 'maxSize'
            };
        }

        if (error === null && !this.isValidNumber(uploads)) {
            error = {
                js: content.documentUploadMaxFilesExceeded,
                nonJs: 'maxFiles'
            };
        }

        return error;
    }
}

module.exports = DocumentUpload;
