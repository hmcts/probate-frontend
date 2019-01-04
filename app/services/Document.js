'use strict';

const Service = require('./Service');
const superagent = require('superagent');

class Document extends Service {
    post(userId, uploadedDocument) {
        this.log('Post document');
        const path = this.config.documentUpload.paths.upload;
        const url = this.formatUrl.format(this.endpoint, path);
        const clientName = this.config.services.idam.probate_oauth2_client;
        const secret = this.config.services.idam.service_key;
        return superagent
            .post(url)
            .set('Authorization', `Basic ${new Buffer(`${clientName}:${secret}`).toString('base64')}`)
            .set('enctype', 'multipart/form-data')
            .set('user-id', userId)
            .attach('file', uploadedDocument.buffer, uploadedDocument.originalname);
    }

    delete(documentId, userId) {
        this.log('Delete document');
        const path = this.config.documentUpload.paths.remove;
        const removeDocumentUrl = this.formatUrl.format(this.endpoint, `${path}/${documentId}`);
        const headers = {
            'user-id': userId
        };
        const fetchOptions = this.fetchOptions({}, 'DELETE', headers);
        return this.fetchText(removeDocumentUrl, fetchOptions);
    }
}

module.exports = Document;
