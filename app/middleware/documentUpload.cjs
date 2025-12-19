'use strict';

const config = require('config');
const DocumentUpload = require('app/utils/DocumentUpload');
const connectTimeout = require('connect-timeout');
const multer = require('multer');
const Document = require('app/services/Document.cjs');
const ServiceMapper = require('app/utils/ServiceMapper.cjs');

const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const documentUpload = new DocumentUpload();

const getDocument = () => upload.single('file');

const initTimeout = () => connectTimeout(config.documentUpload.timeoutMs, {respond: false});

const errorOnTimeout = (req, res, next) => {
    if (req.timedout) {
        req.log.error('Document upload timed out');
        const error = documentUpload.mapError(req.session.language, 'uploadTimeout');
        return returnError(req, res, next, error);
    }
    next();
};

const returnError = (req, res, next, error) => {
    if (req.get('x-csrf-token')) {
        res.status(400);
        return res.send(error.js);
    }
    req.session.form.documents.error = error.nonJs;
    console.info(`Uploaded document returnError error: ${req.session.form.documents.error}`);
    next();
};

const uploadDocument = (req, res, next) => {
    const isUploadingDocument = req.body && req.body.isUploadingDocument;
    const maxFileSize = (req.body && req.body.maxFileSize) || config.documentUpload.maxSizeBytes;

    if (!isUploadingDocument) {
        return next();
    }

    const uploadedDocument = req.file;
    let formdata = req.session.form;
    formdata = documentUpload.initDocuments(formdata);
    const uploads = formdata.documents.uploads;
    const error = documentUpload.validate(uploadedDocument, uploads, maxFileSize, req.session.language);
    console.info('uploadDocument documentUpload.validate error:' + error);
    if (error === null) {
        req.log.info(`Uploaded document passed frontend validation for case: ${req.session.form.ccdCase.id}`);
        const document = new Document(config.services.orchestrator.url, req.sessionID);
        document.post(req.session.regId, uploadedDocument, req.authToken, req.session.serviceAuthorization)
            .then(result => {
                const resultBody = result.body[0];
                const filename = uploadedDocument.originalname;
                if (resultBody.includes('http://')) {
                    req.session.form.documents.uploads = documentUpload.addDocument(filename, resultBody, uploads);
                    next();
                } else {
                    req.log.error(`Uploaded document failed backend validation for case: ${req.session.form.ccdCase.id}`);
                    const errorType = Object.entries(config.documentUpload.error).filter(value => value[1] === resultBody)[0][0];
                    const error = documentUpload.mapError(req.session.language, errorType);
                    returnError(req, res, next, error);
                }
            })
            .catch((err) => {
                req.log.error(`Document upload failed: ${err}`);
                const error = documentUpload.mapError(req.session.language, 'uploadFailed');
                returnError(req, res, next, error);
            });
    } else {
        req.log.error('Uploaded document failed frontend validation');
        returnError(req, res, next, error);
    }
};

const removeDocument = (req, res, next) => {
    const index = req.params.index;
    const uploads = req.session.form.documents.uploads;
    const {url} = uploads[index];
    const documentId = documentUpload.findDocumentId(url);
    const document = new Document(config.services.orchestrator.url, req.sessionID);
    document.delete(documentId, req.session.regId, req.authToken, req.session.serviceAuthorization)
        .then(() => {
            req.session.form.documents.uploads = documentUpload.removeDocument(index, uploads);
            persistFormData(req.session.form.ccdCase.id, req.session.form, req.session.regId, req);
            res.redirect('/provide-information');
        })
        .catch((err) => {
            next(err);
        });
};

const persistFormData = (ccdCaseId, formdata, sessionID, req) => {
    const formData = ServiceMapper.map(
        'FormData',
        [config.services.orchestrator.url, sessionID]
    );
    return formData.post(req.authToken, req.session.serviceAuthorization, ccdCaseId, formdata);
};

module.exports = {
    getDocument,
    initTimeout,
    errorOnTimeout,
    returnError,
    uploadDocument,
    removeDocument
};
