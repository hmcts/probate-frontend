'use strict';

<<<<<<< HEAD
const fileType = require('file-type');
const config = require('app/config').documentUpload;
const content = require('app/resources/en/translation/common');

class DocumentUpload {
    initDocuments(formdata) {
=======
class DocumentUpload {
    static initDocuments(formdata) {
>>>>>>> PRO-3749: Add DocumentUpload class for methods used in the document upload routes
        if (!formdata.documents) {
            formdata.documents = {};
        }
        return formdata;
    }

<<<<<<< HEAD
    addDocument(filename, url, uploads = []) {
        if (filename && url) {
            uploads.push({filename, url});
=======
    static addDocument(uploadedFile, uploads = []) {
        if (uploadedFile) {
            uploads.push(uploadedFile);
>>>>>>> PRO-3749: Add DocumentUpload class for methods used in the document upload routes
        }
        return uploads;
    }

<<<<<<< HEAD
    removeDocument(index, uploads = []) {
        if (!isNaN(index) && uploads.length > 0) {
=======
    static removeDocument(index, uploads) {
        if (!isNaN(index)) {
>>>>>>> PRO-3749: Add DocumentUpload class for methods used in the document upload routes
            uploads.splice(index, 1);
        }
        return uploads;
    }
<<<<<<< HEAD

    findDocumentId(url = '') {
        return url.split('/').reduce((acc, val) => {
            acc = val;
            return acc;
        });
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
            error = this.mapError(config.error.invalidFileType);
        }

        if (error === null && !this.isValidSize(document)) {
            error = this.mapError(config.error.maxSize);
        }

        if (error === null && !this.isValidNumber(uploads)) {
            error = this.mapError(config.error.maxFilesExceeded);
        }

        return error;
    }

    errorKey(errorType) {
        const errorKey = Object.entries(config.error).filter((value) => {
            return value[1] === errorType ? value : null;
        });
        return errorKey[0] ? errorKey[0][0] : null;
    }

    mapError(errorType) {
        const errorKey = this.errorKey(errorType);
        return {
            js: content[`documentUpload-${errorKey}`],
            nonJs: errorKey
        };
    }
=======
>>>>>>> PRO-3749: Add DocumentUpload class for methods used in the document upload routes
}

module.exports = DocumentUpload;
