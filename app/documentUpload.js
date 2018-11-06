'use strict';

const router = require('express').Router();
const services = require('app/components/services');
const DocumentUpload = require('app/utils/DocumentUpload');
const documentUpload = new DocumentUpload();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const logger = require('app/components/logger');

router.post('/', upload.single('file'), (req, res, next) => {
    const uploadedDocument = req.file;
    let formdata = req.session.form;
    formdata = documentUpload.initDocuments(formdata);
    const error = documentUpload.error(uploadedDocument);

    if (error === null) {
        logger(req.sessionID).info('Uploaded document is valid');
        services.uploadDocument(req.session.id);
        formdata.documents.uploads = documentUpload.addDocument(uploadedDocument, formdata.documents.uploads);
    } else {
        logger(req.sessionID).info('Uploaded document is invalid');
        if (req.get('x-csrf-token')) {
            return res.status(400).send(error.js);
        }
        formdata.documents.error = error.nonJs;
    }

    return next();
});

router.get('/remove/:index', (req, res) => {
    const uploads = req.session.form.documents.uploads;
    req.session.form.documents.uploads = documentUpload.removeDocument(req.params.index, uploads);
    res.redirect('/document-upload');
});

module.exports = router;
