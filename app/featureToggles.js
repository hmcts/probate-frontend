'use strict';

const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();

router.get('/applicant-alias', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'main_applicant_alias', featureToggle.togglePage, 'applicant-phone'));
router.get('/applicant-alias-reason', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'main_applicant_alias', featureToggle.togglePage, 'applicant-phone'));
router.get('/summary/*', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'main_applicant_alias', featureToggle.toggleFeature));
router.get('/tasklist', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'main_applicant_alias', featureToggle.toggleFeature));

router.get('/executor-current-name/:index', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'main_applicant_alias', featureToggle.toggleFeature));
router.get('/executor-current-name-reason/:index', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'main_applicant_alias', featureToggle.toggleFeature));
router.get('/executor-current-name-reason/:index', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'main_applicant_alias', featureToggle.togglePage, `/executor-current-name/${req.params.index}`));
router.get('/document-upload', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'document_upload', featureToggle.togglePage, '/tasklist'));

module.exports = router;
