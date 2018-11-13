'use strict';

const utils = require('app/components/api-utils');
const config = require('app/config');
const services = require('app/components/services');
const BUSINESS_DOCUMENT_URL = config.services.businessDocument.url;
const logger = require('app/components/logger');
const logInfo = (message, sessionId = 'Init') => logger(sessionId).info(message);

const createCheckAnswersPdf = (formdata, sessionId) => {
    logInfo('Create check your answers PDF', sessionId);
    return services.authorise()
        .then(serviceToken => {
            const body = {
                checkAnswersSummary: formdata.checkAnswersSummary
            };
            return createPDFDocument(formdata, serviceToken, body, 'generateCheckAnswersSummaryPDF');
        });
};

const createDeclarationPdf = (formdata, sessionId) => {
    logInfo('Create legal declaration PDF', sessionId);
    return services.authorise()
        .then(serviceToken => {
            const body = {
                legalDeclaration: formdata.legalDeclaration
            };
            return createPDFDocument(formdata, serviceToken, body, 'generateLegalDeclarationPDF');
        });
};

function createPDFDocument(formdata, serviceToken, body, pdfTemplate) {
    const headers = {
        'Content-Type': 'application/json',
        'ServiceAuthorization': serviceToken
    };
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    return utils.fetchBuffer(`${BUSINESS_DOCUMENT_URL}/` + pdfTemplate, fetchOptions);
}

module.exports = {
    createCheckAnswersPdf,
    createDeclarationPdf
};
