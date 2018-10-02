// eslint-disable-line max-lines

'use strict';

const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();

router.get('/applicant-alias', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        redirectPage: 'applicant-phone',
        featureToggleKey: 'main_applicant_alias',
        callback: featureToggle.togglePage
    });
});
router.get('/applicant-alias-reason', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        redirectPage: 'applicant-phone',
        featureToggleKey: 'main_applicant_alias',
        callback: featureToggle.togglePage
    });
});
router.get('/summary/*', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        featureToggleKey: 'main_applicant_alias',
        callback: featureToggle.toggleFeature
    });
});

router.get('/new-start-eligibility', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        redirectPage: 'start-eligibility',
        featureToggleKey: 'screening_questions',
        callback: featureToggle.togglePage
    });
});
router.get('/new-will-left', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        redirectPage: 'will-left',
        featureToggleKey: 'screening_questions',
        callback: featureToggle.togglePage
    });
});
router.get('/new-will-original', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        redirectPage: 'will-original',
        featureToggleKey: 'screening_questions',
        callback: featureToggle.togglePage
    });
});
router.get('/new-death-certificate', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        redirectPage: 'death-certificate',
        featureToggleKey: 'screening_questions',
        callback: featureToggle.togglePage
    });
});
router.get('/new-deceased-domicile', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        redirectPage: 'deceased-domicile',
        featureToggleKey: 'screening_questions',
        callback: featureToggle.togglePage
    });
});
router.get('/new-applicant-executor', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        redirectPage: 'applicant-executor',
        featureToggleKey: 'screening_questions',
        callback: featureToggle.togglePage
    });
});
router.get('/new-mental-capacity', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        redirectPage: 'mental-capacity',
        featureToggleKey: 'screening_questions',
        callback: featureToggle.togglePage
    });
});
router.get('/new-iht-completed', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        redirectPage: 'iht-completed',
        featureToggleKey: 'screening_questions',
        callback: featureToggle.togglePage
    });
});
router.get('/new-start-apply', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        redirectPage: 'start-apply',
        featureToggleKey: 'screening_questions',
        callback: featureToggle.togglePage
    });
});

router.post('/deceased-name', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        featureToggleKey: 'screening_questions',
        callback: featureToggle.toggleFeature
    });
});
router.post('/deceased-dob', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        featureToggleKey: 'screening_questions',
        callback: featureToggle.toggleFeature
    });
});
router.post('/deceased-dod', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        featureToggleKey: 'screening_questions',
        callback: featureToggle.toggleFeature
    });
});
router.post('/deceased-address', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        featureToggleKey: 'screening_questions',
        callback: featureToggle.toggleFeature
    });
});
router.post('/iht-value', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        featureToggleKey: 'screening_questions',
        callback: featureToggle.toggleFeature
    });
});
router.post('/iht-paper', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        featureToggleKey: 'screening_questions',
        callback: featureToggle.toggleFeature
    });
});
router.post('/deceased-married', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        featureToggleKey: 'screening_questions',
        callback: featureToggle.toggleFeature
    });
});
router.post('/will-codicils', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        featureToggleKey: 'screening_questions',
        callback: featureToggle.toggleFeature
    });
});
router.post('/codicils-number', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        featureToggleKey: 'screening_questions',
        callback: featureToggle.toggleFeature
    });
});

module.exports = router;
