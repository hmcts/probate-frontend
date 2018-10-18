'use strict';

const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();

router.get('/applicant-alias', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'main_applicant_alias', featureToggle.togglePage, 'applicant-phone'));
router.get('/applicant-alias-reason', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'main_applicant_alias', featureToggle.togglePage, 'applicant-phone'));
router.get('/summary/*', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'main_applicant_alias', featureToggle.toggleFeature));
router.get('/summary/*', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));

router.get('/tasklist', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));

router.get('/new-start-eligibility', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/new-will-left', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.togglePage, 'will-left'));
router.get('/new-will-original', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.togglePage, 'will-original'));
router.get('/new-death-certificate', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.togglePage, 'death-certificate'));
router.get('/new-deceased-domicile', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.togglePage, 'deceased-domicile'));
router.get('/new-applicant-executor', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.togglePage, 'applicant-executor'));
router.get('/new-mental-capacity', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.togglePage, 'mental-capacity'));
router.get('/new-iht-completed', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.togglePage, 'iht-completed'));
router.get('/new-start-apply', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.togglePage, 'start-apply'));

router.post('/deceased-name', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));
router.post('/deceased-dob', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));
router.post('/deceased-dod', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));
router.post('/deceased-address', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));
router.post('/iht-value', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));
router.post('/iht-paper', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));
router.post('/deceased-married', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));
router.post('/will-codicils', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));
router.post('/codicils-number', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));

router.post('/executors-number', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));
router.post('/executors-when-died', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));
router.post('/executors-address', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));
router.post('/executors-roles', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));
router.post('/executors-notified', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'screening_questions', featureToggle.toggleFeature));

router.get('/executor-current-name/:index', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'main_applicant_alias', featureToggle.toggleFeature));
router.get('/executor-current-name-reason/:index', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'main_applicant_alias', featureToggle.toggleFeature));
router.get('/executor-current-name-reason/:index', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'main_applicant_alias', featureToggle.togglePage, `/executor-current-name/${req.params.index}`));
router.get('/document-upload', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'document_upload', featureToggle.togglePage, '/tasklist'));

module.exports = router;
