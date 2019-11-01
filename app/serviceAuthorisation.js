'use strict';

const router = require('express').Router();
const setServiceAuthorisationToken = require('app/middleware/setServiceAuthorisationToken');

router.get('/', (req, res, next) => setServiceAuthorisationToken(req, res, next));

module.exports = router;
