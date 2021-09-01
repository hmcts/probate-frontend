'use strict';

const router = require('express').Router();
const multipleApplications = require('app/middleware/multipleApplications');

router.get('/', (req, res) => {
    res.redirect('/dashboard*');
});
router.get('/dashboard*', (req, res, next) => multipleApplications.initDashboard(req, res, next));
router.get('/get-case/*', (req, res, next) => multipleApplications.getCase(req, res, next));
router.get('/task-list', (req, res, next) => multipleApplications.getDeclarationStatuses(req, res, next));

module.exports = router;
