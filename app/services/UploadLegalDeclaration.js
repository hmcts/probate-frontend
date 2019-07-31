'use strict';

const config = require('app/config');
const ServiceMapper = require('app/utils/ServiceMapper');
const Document = require('app/services/Document');

class UploadLegalDeclaration {

    generateAndUpload(sessionId, userId, formdata, caseType) {
        const fileName = 'SOT.pdf';
        const declarationPdf = ServiceMapper.map(
            'DeclarationPdf',
            [config.services.validation.url, sessionId],
            caseType
        );
        const document = new Document(config.services.validation.url, sessionId);
        return declarationPdf.post(formdata)
            .then(
                buffer => {
                    return {buffer: buffer, originalname: fileName};
                })
            .then(uploadedDocument => document.post(userId, uploadedDocument))
            .then(result => {
                const url = result.body[0];
                return {url: url, filename: fileName};
            });
    }
}

module.exports = UploadLegalDeclaration;
