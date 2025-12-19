'use strict';

const router = require('express').Router();
const documentUpload = require('app/middleware/documentUpload.cjs');

router.post(
    '/',
    documentUpload.getDocument(),
    documentUpload.initTimeout(),
    documentUpload.uploadDocument,
    documentUpload.errorOnTimeout
);

router.get(
    '/remove/:index',
    documentUpload.removeDocument
);

module.exports = router;
