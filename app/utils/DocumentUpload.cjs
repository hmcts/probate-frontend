'use strict';

const fileType = require('file-type');
const config = require('config').documentUpload;

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

    isDocument(document) {
        return typeof document === 'object';
    }

    isValidType(document = {}) {
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

    isValidSize(document, maxFileSize = config.maxSizeBytes) {
        return document.size <= maxFileSize;
    }

    isValidNumber(uploads = []) {
        return uploads.length < config.maxFiles;
    }

    validate(document, uploads, maxFileSize, language = 'en') {
        let error = null;

        if (!this.isDocument(document)) {
            error = this.mapError(language, 'nothingUploaded');
        }

        if (error === null && !this.isValidType(document)) {
            error = this.mapError(language, 'invalidFileType');
        }

        if (error === null && !this.isValidSize(document, maxFileSize)) {
            error = this.mapError(language, 'maxSize');
        }

        if (error === null && !this.isValidNumber(uploads)) {
            error = this.mapError(language, 'maxFiles');
        }

        return error;
    }

    mapError(language, errorKey) {
        const content = require(`app/resources/${language}/translation/common`);

        return {
            js: content[`documentUpload-${errorKey}`],
            nonJs: errorKey
        };
    }
}

module.exports = DocumentUpload;
