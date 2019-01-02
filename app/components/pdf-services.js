'use strict';

const utils = require('app/components/api-utils');
const config = require('app/config');
const services = require('app/components/services');
const FormatUrl = require('app/utils/FormatUrl');
const VALIDATION_SERVICE_URL = config.services.validation.url;
const logger = require('app/components/logger');
const Authorise = require('app/services/Authorise');
const businessDocumentUrl = config.services.businessDocument.url;
const logInfo = (message, sessionId = 'Init') => logger(sessionId).info(message);

const createCheckAnswersPdf = (formdata, sessionId) => {
    logInfo('Create check your answers PDF', sessionId);
    const authorise = new Authorise(`${config.services.idam.s2s_url}/lease`, formdata.journeyType, sessionId);
    return authorise
        .post()
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

const createCoverSheetPdf = (formdata, sessionId) => {
    logInfo('Create cover sheet PDF', sessionId);
    return services.authorise()
        .then(serviceToken => {
            const body = {
                bulkScanCoverSheet: {
                    applicantAddress: formdata.applicant.address,
                    caseReference: formdata.ccdCase.id,
                    submitAddress: formdata.registry.address
                }
            };
            return createPDFDocument(formdata, serviceToken, body, 'generateBulkScanCoverSheetPDF');
        });
};

const createPDFDocument = (formdata, serviceToken, body, pdfTemplate) => {
    const headers = {
        'Content-Type': 'application/json',
        'ServiceAuthorization': serviceToken
    };
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    const businessDocumentURL = FormatUrl.format(VALIDATION_SERVICE_URL, '/businessDocument');
    return utils.fetchBuffer(`${businessDocumentURL}/${pdfTemplate}`, fetchOptions);
};

module.exports = {
    createCheckAnswersPdf,
    createDeclarationPdf,
    createCoverSheetPdf
};
