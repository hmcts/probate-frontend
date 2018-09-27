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

module.exports = router;
