'use strict';

const config = require('app/config');
const DocumentUpload = require('app/utils/DocumentUpload');
const connectTimeout = require('connect-timeout');
const multer = require('multer');
const Document = require('app/services/Document');
const ServiceMapper = require('app/utils/ServiceMapper');

const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const documentUpload = new DocumentUpload();

const getDocument = () => upload.single('file');

const initTimeout = () => connectTimeout(config.documentUpload.timeoutMs, {respond: false});

const errorOnTimeout = (req, res, next) => {
    if (req.timedout) {
        req.log.error('Document upload timed out');
        const error = documentUpload.mapError('uploadTimeout');
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
    const error = documentUpload.validate(uploadedDocument, uploads, maxFileSize);

    if (error === null) {
        req.log.info('Uploaded document passed frontend validation');
        const document = new Document(config.services.validation.url, req.sessionID);
        document.post(req.session.regId, uploadedDocument)
            .then(result => {
                const resultBody = result.body[0];
                const filename = uploadedDocument.originalname;
                if (resultBody.includes('http://')) {
                    req.session.form.documents.uploads = documentUpload.addDocument(filename, resultBody, uploads);
                    next();
                } else {
                    req.log.error('Uploaded document failed backend validation');
                    const errorType = Object.entries(config.documentUpload.error).filter(value => value[1] === resultBody)[0][0];
                    const error = documentUpload.mapError(errorType);
                    returnError(req, res, next, error);
                }
            })
            .catch((err) => {
                req.log.error(`Document upload failed: ${err}`);
                const error = documentUpload.mapError('uploadFailed');
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
    const document = new Document(config.services.validation.url, req.sessionID);
    document.delete(documentId, req.session.regId)
        .then(() => {
            req.session.form.documents.uploads = documentUpload.removeDocument(index, uploads);
            persistFormData(req.session.regId, req.session.form, req.sessionID);
            res.redirect('/document-upload');
        })
        .catch((err) => {
            next(err);
        });
};

const persistFormData = (id, formdata, sessionID) => {
    const formData = ServiceMapper.map(
        'FormData',
        [config.services.persistence.url, sessionID],
        formdata.caseType
    );
    return formData.post(id, formdata, sessionID);
};

module.exports = {
    getDocument,
    initTimeout,
    errorOnTimeout,
    returnError,
    uploadDocument,
    removeDocument
};
