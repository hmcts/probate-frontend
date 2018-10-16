'use strict';

const router = require('express').Router();
const services = require('app/components/services');
const DocumentUpload = require('app/utils/DocumentUpload');

router.post('/add', (req, res) => {
    const uploadedFile = req.body.file;
    let formdata = req.session.form;
    services.uploadDocument(req.session.id);
    formdata = DocumentUpload.initDocuments(formdata);
    formdata.documents.uploads = DocumentUpload.addDocument(uploadedFile, formdata.documents.uploads);
    res.redirect('/document-upload');
});

router.get('/remove/:index', (req, res) => {
    const uploads = req.session.form.documents.uploads;
    req.session.form.documents.uploads = DocumentUpload.removeDocument(req.params.index, uploads);
    res.redirect('/document-upload');
});

module.exports = router;
