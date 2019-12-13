/*eslint complexity: ["off"]*/

'use strict';

const config = require('app/config');
const router = require('express').Router();
const initSteps = require('app/core/initSteps');
const logger = require('app/components/logger');
const {get, includes, isEqual} = require('lodash');
const commonContent = require('app/resources/en/translation/common');
const ExecutorsWrapper = require('app/wrappers/Executors');
const documentUpload = require('app/documentUpload');
const documentDownload = require('app/documentDownload');
const multipleApplications = require('app/multipleApplications');
const serviceAuthorisationToken = require('app/serviceAuthorisation');
const paymentFees = require('app/paymentFees');
const setJourney = require('app/middleware/setJourney');
const AllExecutorsAgreed = require('app/services/AllExecutorsAgreed');
const lockPaymentAttempt = require('app/middleware/lockPaymentAttempt');
const caseTypes = require('app/utils/CaseTypes');
const emailValidator = require('email-validator');
const steps = initSteps([`${__dirname}/steps/action/`, `${__dirname}/steps/ui`]);
const Security = require('app/services/Security');
const Authorise = require('app/services/Authorise');
const FormatUrl = require('app/utils/FormatUrl');

router.all('*', (req, res, next) => {
    req.log = logger(req.sessionID);
    req.log.info(`Processing ${req.method} for ${req.originalUrl}`);
    next();
});

router.use((req, res, next) => {
    if (!req.session.form) {
        req.session.form = {
            payloadVersion: config.payloadVersion,
            applicantEmail: req.session.regId,
            applicant: {},
            deceased: {}
        };
        req.session.back = [];
    }

    if (!req.session.form.applicantEmail) {
        req.session.form.applicantEmail = req.session.regId;
    }

    if (config.app.useIDAM === 'true') {
        req.userLoggedIn = config.noHeaderLinksPages.includes(req.originalUrl) ? false : emailValidator.validate(req.session.form.applicantEmail);
    } else if (!config.noHeaderLinksPages.includes(req.originalUrl)) {
        req.userLoggedIn = true;
    }
    req.log.info(`User logged in: ${req.userLoggedIn}`);

    next();
});

router.use(serviceAuthorisationToken);
router.use(setJourney);
router.use(multipleApplications);
router.use(documentDownload);
router.use(paymentFees);
router.post('/payment-breakdown', lockPaymentAttempt);

router.get('/health/liveness', (req, res) => {
    res.json({status: 'UP'});
});

router.get('/start-apply', (req, res, next) => {
    if (config.app.useIDAM === 'true' && req.userLoggedIn) {
        res.redirect(301, '/dashboard');
    } else {
        next();
    }
});

router.use((req, res, next) => {
    const formdata = req.session.form;
    const ccdCaseId = formdata.ccdCase ? formdata.ccdCase.id : 'undefined';
    const hasMultipleApplicants = (new ExecutorsWrapper(formdata.executors)).hasMultipleApplicants();

    if (hasMultipleApplicants &&
        get(formdata, 'executors.invitesSent', false).toString() === 'true' &&
        get(formdata, 'declaration.declarationCheckbox', false).toString() === 'true'
    ) {
        const allExecutorsAgreed = new AllExecutorsAgreed(config.services.orchestrator.url, req.sessionID);

        if (req.userLoggedIn) {
            allExecutorsAgreed.get(req.authToken, req.session.serviceAuthorization, ccdCaseId)
                .then(data => {
                    req.session.haveAllExecutorsDeclared = data;
                    next();
                })
                .catch(err => {
                    next(err);
                });
        } else {
            const authorise = new Authorise(config.services.idam.s2s_url, req.sessionID);
            authorise.post()
                .then((serviceAuthorisation) => {
                    if (serviceAuthorisation.name === 'Error') {
                        logger.info(`serviceAuthResult Error = ${serviceAuthorisation}`);
                        res.status(500);
                        res.render('errors/500', {userLoggedIn: false});
                    } else {
                        const security = new Security();
                        const hostname = FormatUrl.createHostname(req);
                        security.getUserToken(hostname)
                            .then((authToken) => {
                                if (authToken.name === 'Error') {
                                    logger.info(`failed to obtain authToken = ${serviceAuthorisation}`);
                                    res.status(500);
                                    res.render('errors/500', {userLoggedIn: false});
                                } else {
                                    allExecutorsAgreed.get(authToken, serviceAuthorisation, ccdCaseId)
                                        .then(data => {
                                            req.session.haveAllExecutorsDeclared = data;
                                            next();
                                        })
                                        .catch(err => {
                                            next(err);
                                        });
                                }
                            })
                            .catch((err) => {
                                logger.info(`failed to obtain authToken = ${err}`);
                            });
                    }
                })
                .catch((err) => {
                    logger.info(`serviceAuthResult Error = ${err}`);
                    next(err);
                });
        }
    } else {
        next();
    }
});

router.use((req, res, next) => {
    const formdata = req.session.form;
    const isHardStop = (formdata, journey) => config.hardStopParams[journey].some(param => get(formdata, param) === commonContent.no);
    const executorsWrapper = new ExecutorsWrapper(formdata.executors);
    const hasMultipleApplicants = executorsWrapper.hasMultipleApplicants();

    const allPageUrls = [];
    Object.entries(steps).forEach(([, step]) => {
        const stepUrl = step.constructor.getUrl().split('/')[1];
        if (!includes(allPageUrls, stepUrl)) {
            allPageUrls.push(stepUrl);
        }
    });

    const noCcdCaseIdPages = config.noCcdCaseIdPages.map(item => item.split('/')[0]);

    if (config.app.requreCcdCaseId === 'true' && includes(allPageUrls, req.originalUrl.split('/')[1]) && req.method === 'GET' && !includes(noCcdCaseIdPages, req.originalUrl.split('/')[1]) && !get(formdata, 'ccdCase.id')) {
        res.redirect('/dashboard');
    } else if (get(formdata, 'ccdCase.state') === 'CaseCreated' && (get(formdata, 'documents.sentDocuments', 'false') === 'false') && (get(formdata, 'payment.status') === 'Success' || get(formdata, 'payment.status') === 'not_required') &&
        !includes(config.whitelistedPagesAfterSubmission, req.originalUrl)
    ) {
        res.redirect('/documents');
    } else if (get(formdata, 'ccdCase.state') === 'CaseCreated' && (get(formdata, 'documents.sentDocuments', 'false') === 'true') && (get(formdata, 'payment.status') === 'Success' || get(formdata, 'payment.status') === 'not_required') &&
        !includes(config.whitelistedPagesAfterSubmission, req.originalUrl)
    ) {
        res.redirect('/thank-you');
    } else if ((get(formdata, 'payment.total') === 0 || get(formdata, 'payment.status') === 'Success') &&
        !includes(config.whitelistedPagesAfterPayment, req.originalUrl)
    ) {
        res.redirect('/task-list');
    } else if ((get(formdata, 'declaration.declarationCheckbox', false)).toString() === 'true' &&
        !includes(config.whitelistedPagesAfterDeclaration, req.originalUrl) &&
        (!hasMultipleApplicants || (get(formdata, 'executors.invitesSent') && req.session.haveAllExecutorsDeclared === 'true'))
    ) {
        res.redirect('/task-list');
    } else if ((get(formdata, 'declaration.declarationCheckbox', false)).toString() === 'true' &&
        (!hasMultipleApplicants || (get(formdata, 'executors.invitesSent'))) &&
            isEqual('/executors-invite', req.originalUrl)
    ) {
        res.redirect('/task-list');
    } else if ((get(formdata, 'declaration.declarationCheckbox', false)).toString() === 'true' &&
        (!hasMultipleApplicants || !(get(formdata, 'executors.executorsEmailChanged'))) &&
            isEqual('/executors-update-invite', req.originalUrl)
    ) {
        res.redirect('/task-list');
    } else if (req.originalUrl.includes('summary') && isHardStop(formdata, caseTypes.getCaseType(req.session))) {
        res.redirect('/task-list');
    } else {
        next();
    }
});

router.use('/document-upload', documentUpload);

router.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.pageUrl = req.url;
    next();
});

Object.entries(steps).forEach(([, step]) => {
    router.get(step.constructor.getUrl(), step.runner().GET(step));
    router.post(step.constructor.getUrl(), step.runner().POST(step));
});

router.get('/payment', (req, res) => {
    res.redirect(301, '/documents');
});

if (['sandbox', 'saat', 'preview', 'sprod', 'demo', 'aat'].includes(config.environment)) {
    router.get('/inviteIdList', (req, res) => {
        const formdata = req.session.form;
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        res.setHeader('Content-Type', 'text/plain');
        res.send({'ids': executorsWrapper.executorsInvited().map(e => e.inviteId)});
    });

    router.get('/pin', (req, res) => {
        const pin = get(req, 'session.pin', 0);
        res.setHeader('Content-Type', 'text/plain');
        res.send({'pin': pin});
    });
}

module.exports = router;
