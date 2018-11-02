'use strict';

const fileType = require('file-type');
const config = require('app/config');

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

    isDocumentValid(document) {
        let isValid = true;
        isValid = this.isValidType(document);
        return isValid;
    }
}

module.exports = DocumentUpload;
