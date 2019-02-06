'use strict';

const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();

router.get('/summary/*', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'document_upload', featureToggle.toggleFeature));

router.get('/documents', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'document_upload', featureToggle.toggleFeature));
router.get('/document-upload', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'document_upload', featureToggle.togglePage, '/tasklist'));
router.get('/deceased-address', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'document_upload', featureToggle.toggleFeature));
router.post('/deceased-address', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'document_upload', featureToggle.toggleFeature));

router.post('/will-left', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.toggleFeature));
router.get('/died-after-october-2014', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/relationship-to-deceased', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/other-applicants', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));

router.get('/deceased-details', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/assets-outside-england-wales', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/value-assets-outside-england-wales', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));

module.exports = router;
