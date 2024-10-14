'use strict';

const Service = require('./Service');
const superagent = require('superagent');
const AsyncFetch = require('app/utils/AsyncFetch');

class Document extends Service {
    post(userId, uploadedDocument, authToken, serviceAuthorization) {
        this.log('Post document');
        const path = this.config.documentUpload.paths.upload;
        const url = this.formatUrl.format(this.endpoint, path);
        return superagent
            .post(url)
            .set('Authorization', authToken)
            .set('ServiceAuthorization', serviceAuthorization)
            .set('enctype', 'multipart/form-data')
            .set('user-id', userId)
            .attach('file', uploadedDocument.buffer, uploadedDocument.originalname);
    }

    delete(documentId, userId, authToken, serviceAuthorization) {
        this.log('Delete document');
        const path = this.config.documentUpload.paths.remove;
        const removeDocumentUrl = this.formatUrl.format(this.endpoint, `${path}/${documentId}`);
        const headers = {
            'user-id': userId,
            'Authorization': authToken,
            'ServiceAuthorization': serviceAuthorization,
        };
        const fetchOptions = AsyncFetch.fetchOptions({}, 'DELETE', headers);
        return this.fetchText(removeDocumentUrl, fetchOptions);
    }

    notifyApplicant(ccdCaseId, authToken, serviceAuthorisation) {
        this.log('Notify Document upload');
        const url = this.formatUrl.format(this.endpoint, `/document/notification/${ccdCaseId}`);
        const headers = {
            'Content-Type': 'application/json',
            'Session-Id': this.sessionId,
            'Authorization': authToken,
            'ServiceAuthorization': serviceAuthorisation
        };
        const fetchOptions = AsyncFetch.fetchOptions({}, 'POST', headers);
        return AsyncFetch.fetchJson(url, fetchOptions);
    }
}

module.exports = Document;
