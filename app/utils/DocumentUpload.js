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
        const validMimeTypes = config.documentUpload.validMimeTypes;

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
        return document.size <= config.maxSize;
    }

    error(document) {
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

        return error;
    }
}

module.exports = DocumentUpload;
