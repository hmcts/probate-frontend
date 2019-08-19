'use strict';

const router = require('express').Router();
const getUserApplications = require('app/middleware/getUserApplications');

router.get('/dashboard', (req, res, next) => getUserApplications(req, res, next));

module.exports = router;
