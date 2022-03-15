'use strict';

const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();
const completeEqualityTask = require('app/middleware/completeEqualityTask');

router.get('/*', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_avaya_webchat', featureToggle.toggleFeature));

router.get('/equality-and-diversity', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_pcq', completeEqualityTask));

router.get('/start-eligibility', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_fees_api', featureToggle.toggleFeature));
router.get('/deceased-married', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_will_condition', featureToggle.toggleFeature));
router.get('/copies-uk', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_fees_api', featureToggle.toggleFeature));
router.get('/copies-overseas', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_fees_api', featureToggle.toggleFeature));
router.all('/payment-breakdown', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_newfee_register_code', featureToggle.toggleFeature));
router.get('/task-list', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_will_condition', featureToggle.toggleFeature));
router.all('/task-list', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_excepted_estates', featureToggle.toggleFeature));
router.get('/summary/*', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_will_condition', featureToggle.toggleFeature));
router.all('/deceased-domicile', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_excepted_estates', featureToggle.toggleFeature));
router.all('/certificate-interim', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_excepted_estates', featureToggle.toggleFeature));
router.all('/ee-deceased-dod', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_excepted_estates', featureToggle.toggleFeature));
router.all('/ee-estate-valued', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_excepted_estates', featureToggle.toggleFeature));
router.all('/iht-completed', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_excepted_estates', featureToggle.toggleFeature));
router.post('/foreign-death-cert-translation', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_excepted_estates', featureToggle.toggleFeature));
router.post('/english-foreign-death-cert', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_excepted_estates', featureToggle.toggleFeature));

module.exports = router;
