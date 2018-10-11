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

router.get('/executor-current-name/:index', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        featureToggleKey: 'main_applicant_alias',
        callback: featureToggle.toggleFeature
    });
});

router.get('/executor-current-name-reason/:index', (req, res, next) => {
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        featureToggleKey: 'main_applicant_alias',
        callback: featureToggle.toggleFeature
    });
});

router.get('/executor-current-name-reason/:index', (req, res, next) => {
    const index = req.params.index;
    featureToggle.checkToggle({
        req: req,
        res: res,
        next: next,
        redirectPage: `/executor-current-name/${index}`,
        featureToggleKey: 'main_applicant_alias',
        callback: featureToggle.togglePage
    });
});

module.exports = router;
