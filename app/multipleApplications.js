'use strict';

const router = require('express').Router();
const getApplications = require('app/middleware/getApplications');
const getCase = require('app/middleware/getCase');

router.get('/dashboard', (req, res, next) => getApplications(req, res, next));
router.get('/get-case/*', (req, res, next) => getCase(req, res, next));

module.exports = router;
