'use strict';

const config = require('config');
const ServiceMapper = require('app/utils/ServiceMapper');
const Document = require('app/services/Document');

class UploadLegalDeclaration {

    generateAndUpload(sessionId, userId, req) {
        const fileName = 'LegalStatement.pdf';
        const declarationPdf = ServiceMapper.map(
            'DeclarationPdf',
            [config.services.orchestrator.url, sessionId]
        );
        const document =
            new Document(config.services.orchestrator.url, sessionId);
        return declarationPdf.post(req)
            .then(
                buffer => {
                    return {buffer: buffer, originalname: fileName};
                })
            .then(uploadedDocument => document.post(userId, uploadedDocument, req.authToken, req.session.serviceAuthorization))
            .then(result => {
                const url = result.body[0];
                return {url: url, filename: fileName};
            });
    }
}

module.exports = UploadLegalDeclaration;
