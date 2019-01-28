'use strict';

const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();

router.get('/summary/*', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'document_upload', featureToggle.toggleFeature));

router.get('/documents', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'document_upload', featureToggle.toggleFeature));
router.get('/document-upload', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'document_upload', featureToggle.togglePage, '/tasklist'));
router.get('/deceased-address', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'document_upload', featureToggle.toggleFeature));
router.post('/deceased-address', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'document_upload', featureToggle.toggleFeature));

module.exports = router;
