'use strict';

const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();

router.get('/start-eligibility', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'fees_api', featureToggle.toggleFeature));
router.get('/copies-uk', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'fees_api', featureToggle.toggleFeature));
router.get('/copies-overseas', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'fees_api', featureToggle.toggleFeature));
router.all('/payment-breakdown', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'fees_api', featureToggle.toggleFeature));

router.get('/dashboard', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'multiple_applications', featureToggle.togglePage, 'task-list'));

module.exports = router;
