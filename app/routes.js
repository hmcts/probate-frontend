/*eslint complexity: ["off"]*/

'use strict';

const config = require('config');
const router = require('express').Router();
const initSteps = require('app/core/initSteps');
const logger = require('app/components/logger');
const get = require('lodash').get;
const ApplicantWrapper = require('app/wrappers/Applicant');
const CcdCaseWrapper = require('app/wrappers/CcdCase');
const DocumentsWrapper = require('app/wrappers/Documents');
const ExecutorsWrapper = require('app/wrappers/Executors');
const PaymentWrapper = require('app/wrappers/Payment');
const documentUpload = require('app/documentUpload');
const documentDownload = require('app/documentDownload');
const multipleApplications = require('app/multipleApplications');
const journeyCheck = require('app/journeyCheck');
const serviceAuthorisationToken = require('app/serviceAuthorisation');
const paymentFees = require('app/paymentFees');
const setJourney = require('app/middleware/setJourney');
const AllExecutorsAgreed = require('app/services/AllExecutorsAgreed');
const lockPaymentAttempt = require('app/middleware/lockPaymentAttempt');
const caseTypes = require('app/utils/CaseTypes');
const emailValidator = require('email-validator');
const Security = require('app/services/Security');
const Authorise = require('app/services/Authorise');
const FormatUrl = require('app/utils/FormatUrl');

router.all('*', (req, res, next) => {
    req.log = logger(req.sessionID);
    req.log.info(`Processing ${req.method} for ${req.originalUrl}`);
    if (!req.originalUrl.match(/locale/g)) {
        next();
    }
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
router.use(journeyCheck);
router.use(documentDownload);
router.use(paymentFees);
router.post('/payment-breakdown', lockPaymentAttempt);

router.get('/start-apply', (req, res, next) => {
    if (config.app.useIDAM === 'true' && req.userLoggedIn) {
        res.redirect(301, '/dashboard');
    } else {
        next();
    }
});

router.use(['/task-list', '/assets-overseas', '/copies-overseas', '/copies-uk', '/copies-summary'], (req, res, next) => {
    const formdata = req.session.form;
    const ccdCaseId = formdata.ccdCase ? formdata.ccdCase.id : 'undefined';

    const applicantWrapper = new ApplicantWrapper(formdata);
    const applicantHasDeclared = applicantWrapper.applicantHasDeclared();

    const executorsWrapper = new ExecutorsWrapper(formdata.executors);
    const hasMultipleApplicants = executorsWrapper.hasMultipleApplicants();
    const invitesSent = executorsWrapper.invitesSent();

    if (hasMultipleApplicants && invitesSent && applicantHasDeclared) {
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
                        const commonContent = require(`app/resources/${req.session.language}/translation/common`);

                        logger.info(`serviceAuthResult Error = ${serviceAuthorisation}`);
                        res.status(500).render('errors/error', {common: commonContent, error: '500', userLoggedIn: false});
                    } else {
                        const security = new Security();
                        const hostname = FormatUrl.createHostname(req);
                        security.getUserToken(hostname)
                            .then((authToken) => {
                                if (authToken.name === 'Error') {
                                    const commonContent = require(`app/resources/${req.session.language}/translation/common`);

                                    logger.info(`failed to obtain authToken = ${serviceAuthorisation}`);
                                    res.status(500).render('errors/error', {common: commonContent, error: '500', userLoggedIn: false});
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

const allSteps = {
    'en': initSteps([`${__dirname}/steps/action/`, `${__dirname}/steps/ui`], 'en'),
    'cy': initSteps([`${__dirname}/steps/action/`, `${__dirname}/steps/ui`], 'cy')
};

router.use((req, res, next) => {
    const steps = allSteps[req.session.language];
    const currentPageCleanUrl = FormatUrl.getCleanPageUrl(req.originalUrl, 1);
    const formdata = req.session.form;
    const isHardStop = (formdata, journey) => config.hardStopParams[journey].some(param => get(formdata, param) === 'optionNo');

    const applicantWrapper = new ApplicantWrapper(formdata);
    const applicantHasDeclared = applicantWrapper.applicantHasDeclared();

    const ccdCaseWrapper = new CcdCaseWrapper(formdata.ccdCase);
    const applicationSubmitted = ccdCaseWrapper.applicationSubmitted();

    const documentsWrapper = new DocumentsWrapper(formdata);
    const documentsSent = documentsWrapper.documentsSent();

    const executorsWrapper = new ExecutorsWrapper(formdata.executors, req.session.haveAllExecutorsDeclared);
    const hasMultipleApplicants = executorsWrapper.hasMultipleApplicants();
    const invitesSent = executorsWrapper.invitesSent();
    const hasExecutorsEmailChanged = executorsWrapper.hasExecutorsEmailChanged();
    const allExecutorsHaveDeclared = executorsWrapper.haveAllExecutorsDeclared();

    const paymentWrapper = new PaymentWrapper(formdata.payment);
    const applicantHasPassedPayment = paymentWrapper.hasPassedPayment();
    const paymentIsSuccessful = paymentWrapper.paymentIsSuccessful();
    const paymentIsNotRequired = paymentWrapper.paymentIsNotRequired();

    const allPageUrls = [];
    Object.entries(steps).forEach(([, step]) => {
        const stepUrl = FormatUrl.getCleanPageUrl(step.constructor.getUrl(), 1);
        if (!allPageUrls.includes(stepUrl)) {
            allPageUrls.push(stepUrl);
        }

        router.get(step.constructor.getUrl(), step.runner().GET(step));
        router.post(step.constructor.getUrl(), step.runner().POST(step));
    });

    const noCcdCaseIdPages = config.noCcdCaseIdPages.map(item => FormatUrl.getCleanPageUrl(item, 0));

    if (allPageUrls.includes(currentPageCleanUrl)) {
        if (req.method === 'GET' && config.alwaysWhitelistedPages.includes(currentPageCleanUrl)) {
            next();
        } else if (config.app.requireCcdCaseId === 'true' && req.method === 'GET' && !noCcdCaseIdPages.includes(currentPageCleanUrl) && !get(formdata, 'ccdCase.id')) {
            res.redirect('/dashboard');
        } else if (!applicationSubmitted && config.whitelistedPagesAfterSubmission.includes(currentPageCleanUrl)) {
            res.redirect('/task-list');
        } else if (!applicantHasPassedPayment && config.whitelistedPagesAfterPayment.includes(currentPageCleanUrl)) {
            res.redirect('/task-list');
        } else if (!applicantHasDeclared && !applicationSubmitted && config.blacklistedPagesBeforeDeclaration.includes(currentPageCleanUrl)) {
            res.redirect('/task-list');
        } else if (applicationSubmitted && (paymentIsSuccessful || paymentIsNotRequired) && !config.whitelistedPagesAfterSubmission.includes(currentPageCleanUrl) && !documentsSent) {
            res.redirect('/documents');
        } else if (applicationSubmitted && (paymentIsSuccessful || paymentIsNotRequired) && !config.whitelistedPagesAfterSubmission.includes(currentPageCleanUrl) && documentsSent) {
            res.redirect('/thank-you');
        } else if (applicantHasDeclared && hasMultipleApplicants && invitesSent && !allExecutorsHaveDeclared && config.blacklistedPagesBeforeDeclaration.includes(currentPageCleanUrl)) {
            res.redirect('/task-list');
        } else if (applicantHasDeclared && (!hasMultipleApplicants || (invitesSent && allExecutorsHaveDeclared)) && !config.whitelistedPagesAfterDeclaration.includes(currentPageCleanUrl)) {
            res.redirect('/task-list');
        } else if (applicantHasDeclared && (!hasMultipleApplicants || invitesSent) && currentPageCleanUrl === '/executors-invite') {
            res.redirect('/task-list');
        } else if (applicantHasDeclared && (!hasMultipleApplicants || !hasExecutorsEmailChanged) && currentPageCleanUrl === '/executors-update-invite') {
            res.redirect('/task-list');
        } else if (currentPageCleanUrl === '/summary' && isHardStop(formdata, caseTypes.getCaseType(req.session))) {
            res.redirect('/task-list');
        } else {
            next();
        }
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

router.get('/payment', (req, res) => {
    res.redirect(301, '/documents');
});

if (['sandbox', 'saat', 'preview', 'perftest', 'demo', 'aat'].includes(config.environment)) {
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
