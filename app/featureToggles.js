'use strict';

const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();

router.get('/*', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'webchat', featureToggle.toggleFeature));

router.get('/start-eligibility', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'fees_api', featureToggle.toggleFeature));
router.get('/copies-uk', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'fees_api', featureToggle.toggleFeature));
router.get('/copies-overseas', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'fees_api', featureToggle.toggleFeature));
router.all('/payment-breakdown', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'fees_api', featureToggle.toggleFeature));

router.post('/will-left', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.toggleFeature));
router.get('/died-after-october-2014', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/related-to-deceased', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/other-applicants', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));

router.get('/deceased-details', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/assets-outside-england-wales', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/value-assets-outside-england-wales', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));

router.get('/deceased-marital-status', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/deceased-divorce-place', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));

router.get('/relationship-to-deceased', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/spouse-not-applying-reason', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/any-other-children', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/adoption-place', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/any-children', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/any-deceased-children', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));
router.get('/any-grandchildren-under-18', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'intestacy_questions', featureToggle.togglePage, 'start-eligibility'));

router.get('/dashboard', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'multiple_applications', featureToggle.togglePage, 'task-list'));

module.exports = router;
