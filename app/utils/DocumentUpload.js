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

    addDocument(filename, url, uploads = []) {
        if (filename && url) {
            uploads.push({filename, url});
        }
        return uploads;
    }

    removeDocument(index, uploads = []) {
        if (!isNaN(index) && uploads.length > 0) {
            uploads.splice(index, 1);
        }
        return uploads;
    }

    findDocumentId(url = '') {
        return url.split('/').reduce((acc, val) => {
            acc = val;
            return acc;
        });
    }

    isValidType(document = {}) {
        const uploadedDocumentType = fileType(document.buffer);
        if (!uploadedDocumentType) {
            return false;
        }
        return config.validTypes.includes(uploadedDocumentType.ext);
    }

    isValidSize(document) {
        return document.size <= config.maxSize;
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
        return Object.entries(config.error).filter((value) => {
            if (value[1] === errorType) {
                return value;
            }
            return null;
        })[0][0];
    }

    mapError(errorType) {
        const errorKey = this.errorKey(errorType);
        return {
            js: content[`documentUpload-${errorKey}`],
            nonJs: errorKey
        };
    }
}

module.exports = DocumentUpload;
