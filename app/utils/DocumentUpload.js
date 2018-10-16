'use strict';

class DocumentUpload {
    static initDocuments(formdata) {
        if (!formdata.documents) {
            formdata.documents = {};
        }
        return formdata;
    }

    static addDocument(uploadedFile, uploads = []) {
        if (uploadedFile) {
            uploads.push(uploadedFile);
        }
        return uploads;
    }

    static removeDocument(index, uploads) {
        if (!isNaN(index)) {
            uploads.splice(index, 1);
        }
        return uploads;
    }
}

module.exports = DocumentUpload;
