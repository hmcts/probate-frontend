'use strict';

const router = require('express').Router();
const setServiceAuthorisationToken = require('app/middleware/setServiceAuthorisationToken.cjs');

router.get('/', (req, res, next) => setServiceAuthorisationToken(req, res, next));
router.get('/get-case/*', (req, res, next) => setServiceAuthorisationToken(req, res, next));

module.exports = router;
