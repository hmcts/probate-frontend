'use strict';

const config = require('app/config');
const router = require('express').Router();
const initSteps = require('app/core/initSteps');
const services = require('app/components/services');
const logger = require('app/components/logger');
const {get, includes} = require('lodash');
const commonContent = require('app/resources/en/translation/common');
const ExecutorsWrapper = require('app/wrappers/Executors');

router.all('*', function (req, res, next) {
    req.log = logger(req.sessionID);
    req.log.info(`Processing ${req.method} for ${req.originalUrl}`);
    next();
});

router.use(function (req, res, next) {
    if (!req.session.form) {
        req.session.form = {
            payloadVersion: config.payloadVersion,
            applicantEmail: req.session.regId
        };
        req.session.back = [];
    }
    next();
});

router.get('/', function (req, res) {
    services.loadFormData(req.session.regId)
        .then(result => {
            if (result.name === 'Error') {
                req.log.debug('Failed to load user data');
                req.log.info({tags: 'Analytics'}, 'Application Started');
                res.redirect('start-page');
            } else {
                req.log.debug('Successfully loaded user data');
                req.session.form = result.formdata;
                res.redirect('tasklist');
            }
        });
});

router.use(function (req, res, next) {
    const formdata = req.session.form;
    const isHardStop = formdata => config.hardStopParams.some(param => get(formdata, param) === commonContent.no);
    const hasMultipleApplicants = (new ExecutorsWrapper(formdata.executors)).hasMultipleApplicants();

    if (get(formdata, 'submissionReference') &&
            !includes(config.whitelistedPagesAfterSubmission, req.originalUrl)
    ) {
        res.redirect('documents');
    } else if (formdata.paymentPending === 'false' &&
                !includes(config.whitelistedPagesAfterPayment, req.originalUrl)
    ) {
        res.redirect('tasklist');
    } else if (get(formdata, 'declaration.declarationCheckbox') &&
                !includes(config.whitelistedPagesAfterDeclaration, req.originalUrl) &&
                (!hasMultipleApplicants || (get(formdata, 'executors.invitesSent')))
    ) {
        res.redirect('tasklist');
    } else if (req.originalUrl.includes('summary') && isHardStop(formdata)) {
        res.redirect('/tasklist');
    } else {
        next();
    }
});

router.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.pageUrl = req.url;
    next();
});

router.use((req, res, next) => {
    if (config.nonCachedPages.some(page => req.originalUrl.includes(page))) {
        res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
    }
    next();
});

router.use((req, res, next) => {
    const formdata = req.session.form;
    const hasMultipleApplicants = (new ExecutorsWrapper(formdata.executors)).hasMultipleApplicants();

    if (hasMultipleApplicants &&
        formdata.executors.invitesSent === 'true' &&
        get(formdata, 'declaration.declarationCheckbox')
    ) {
        services.checkAllAgreed(req.session.regId).then(data => {
            req.session.haveAllExecutorsDeclared = data;
            next();
        })
        .catch(err => {
            next(err);
        });
    } else {
        next();
    }
});

const steps = initSteps([`${__dirname}/steps/action/`, `${__dirname}/steps/ui/`]);

Object.entries(steps).forEach(([, step]) => {
    router.get(step.constructor.getUrl(), step.runner().GET(step));
    router.post(step.constructor.getUrl(), step.runner().POST(step));
});

router.get('/payment', function (req, res) {
    res.redirect(301, '/documents');
});

if (process.env.REFORM_ENVIRONMENT === 'dev' || process.env.REFORM_ENVIRONMENT === 'test') {
    router.get('/inviteIdList', function (req, res) {
        const list = get(req, 'session.form.executors.list', []);
        res.send({'ids': list.filter(e => e.inviteId).map(e => e.inviteId)});
    });
    router.get('/pin', function (req, res) {
        const pin = get(req, 'session.pin', 0);
        res.send({'pin': pin});
    });
}

module.exports = router;
