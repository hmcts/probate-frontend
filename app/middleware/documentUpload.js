'use strict';

const config = require('app/config').documentUpload;
const DocumentUpload = require('app/utils/DocumentUpload');
const services = require('app/components/services');
const connectTimeout = require('connect-timeout');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const documentUpload = new DocumentUpload();

const getDocument = () => upload.single('file');

const initTimeout = () => connectTimeout(config.timeoutMs, {respond: false});

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

    if (!isUploadingDocument) {
        return next();
    }

    const uploadedDocument = req.file;
    let formdata = req.session.form;
    formdata = documentUpload.initDocuments(formdata);
    const uploads = formdata.documents.uploads;
    const error = documentUpload.validate(uploadedDocument, uploads);

    if (error === null) {
        req.log.info('Uploaded document passed frontend validation');
        services.uploadDocument(req.session.id, req.session.regId, uploadedDocument)
            .then(result => {
                const resultBody = result.body[0];
                const filename = uploadedDocument.originalname;
                if (resultBody.includes('http://')) {
                    req.session.form.documents.uploads = documentUpload.addDocument(filename, resultBody, uploads);
                    next();
                } else {
                    req.log.error('Uploaded document failed backend validation');
                    const errorType = Object.entries(config.error).filter(value => value[1] === resultBody)[0][0];
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
    services.removeDocument(documentId, req.session.regId)
        .then(() => {
            req.session.form.documents.uploads = documentUpload.removeDocument(index, uploads);
            res.redirect('/document-upload');
        })
        .catch((err) => {
            next(err);
        });
};

module.exports = {
    getDocument,
    initTimeout,
    errorOnTimeout,
    returnError,
    uploadDocument,
    removeDocument
};
