'use strict';

const router = require('express').Router();
const documentDownload = require('app/middleware/documentDownload');

router.get('/check-answers-pdf', (req, res) => documentDownload(req, res, 'CheckAnswersPdf', 'check-your-answers.pdf'));
router.get('/declaration-pdf', (req, res) => documentDownload(req, res, 'DeclarationPdf', 'legal-declaration.pdf'));
router.get('/cover-sheet-pdf', (req, res) => documentDownload(req, res, 'CoverSheetPdf', 'cover-sheet.pdf'));

module.exports = router;
