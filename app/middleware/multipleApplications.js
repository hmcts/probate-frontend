'use strict';

const {get, sortBy} = require('lodash');
const config = require('app/config');
const logger = require('app/components/logger')('Init');
const ServiceMapper = require('app/utils/ServiceMapper');
const caseTypes = require('app/utils/CaseTypes');
const ExecutorsWrapper = require('app/wrappers/Executors');
const contentWillLeft = require('app/resources/en/translation/screeners/willleft');

const initDashboard = (req, res, next) => {
    const session = req.session;
    const formdata = session.form;
    const formData = ServiceMapper.map(
        'FormData',
        [config.services.orchestrator.url, req.sessionID]
    );

    formData.getAll(req.authToken, req.session.serviceAuthorization)
        .then(result => {
            logger.info('>>>>>>>>>>>>>>>>>>>>>> Applications request complete');

            if (result.applications && result.applications.length) {
                logger.info('>>>>>>>>>>>>>>>>>>>>>> Applications found: ', result.applications.length);

                if (allEligibilityQuestionsPresent(formdata)) {
                    logger.info('>>>>>>>>>>>>>>>>>>>>>> All eligibility questions present');

                    if (!result.applications.some(application => application.ccdCase.state === 'Pending' && !application.deceasedFullName && application.caseType === caseTypes.getProbateType(formdata.caseType))) {
                        logger.info(`>>>>>>>>>>>>>>>>>>>>>> No applications of same case type (${caseTypes.getProbateType(formdata.caseType).toUpperCase()}) present`);

                        createNewApplication(req, res, formdata, formData, result, next);
                    } else {
                        logger.info(`>>>>>>>>>>>>>>>>>>>>>> One or more applications of the same case type (${caseTypes.getProbateType(formdata.caseType).toUpperCase()}) present`);

                        renderDashboard(req, result, next);
                    }
                } else {
                    logger.info('>>>>>>>>>>>>>>>>>>>>>> Not all eligibility questions present or no eligibility questions present at all');

                    renderDashboard(req, result, next);
                }
            } else if (allEligibilityQuestionsPresent(formdata)) {
                logger.info('>>>>>>>>>>>>>>>>>>>>>> No applications found');
                logger.info('>>>>>>>>>>>>>>>>>>>>>> All eligibility questions present');

                createNewApplication(req, res, formdata, formData, result, next);
            } else {
                logger.info('>>>>>>>>>>>>>>>>>>>>>> Not all eligibility questions present and no applications found, redirecting to Start Eligibility');

                res.redirect('/start-eligibility');
            }
        })
        .catch(err => {
            logger.info(`Error while getting applications: ${err}`);
        });
};

const createNewApplication = (req, res, formdata, formData, result, next) => {
    logger.info(`>>>>>>>>>>>>>>>>>>>>>> Creating a new ${caseTypes.getProbateType(formdata.caseType).toUpperCase()} application`);

    cleanupSession(req.session, true);

    formData.postNew(req.authToken, req.session.serviceAuthorization, req.session.form.caseType)
        .then(result => {
            logger.info(`>>>>>>>>>>>>>>>>>>>>>> New ${caseTypes.getProbateType(formdata.caseType).toUpperCase()} application created`);

            renderDashboard(req, result, next);
        })
        .catch(err => {
            logger.error(`Error while getting applications: ${err}`);
        });
};

const allEligibilityQuestionsPresent = (formdata) => {
    let allQuestionsPresent = true;

    if (formdata.screeners && formdata.screeners.left) {
        let eligibilityQuestionsList = config.eligibilityQuestionsProbate;
        if (formdata.screeners.left === contentWillLeft.optionNo) {
            eligibilityQuestionsList = config.eligibilityQuestionsIntestacy;
        }

        Object.entries(eligibilityQuestionsList).forEach(([key, value]) => {
            if (!Object.keys(formdata.screeners).includes(key) || formdata.screeners[key] !== value) {
                allQuestionsPresent = false;
            }
        });
    } else {
        allQuestionsPresent = false;
    }

    return allQuestionsPresent;
};

const renderDashboard = (req, result, next) => {
    logger.info('>>>>>>>>>>>>>>>>>>>>>> Deleting eligibility questions from session (if any present) and rendering the dashboard');

    delete req.session.form.caseType;
    delete req.session.form.screeners;

    if (result.applications && result.applications.length) {
        cleanupSession(req.session);
    }

    req.session.form.applications = sortBy(result.applications, 'ccdCase.id');
    next();
};

const getCase = (req, res) => {
    const session = req.session;

    let ccdCaseId = req.originalUrl.split('/')[2];
    if (ccdCaseId) {
        ccdCaseId = ccdCaseId.split('?')[0];
    }

    let probateType = req.originalUrl.split('/')[2];
    if (probateType) {
        probateType = probateType.split('?')[1];

        if (probateType) {
            probateType = probateType.split('=')[1];
        }
    }

    if (!probateType && req.session.form.caseType) {
        probateType = caseTypes.getProbateType(req.session.form.caseType);
    }

    if (ccdCaseId && probateType) {
        const formData = ServiceMapper.map(
            'FormData',
            [config.services.orchestrator.url, req.sessionID]
        );

        formData.get(req.authToken, req.session.serviceAuthorization, ccdCaseId, probateType)
            .then(result => {
                session.form = result;

                if (session.form.ccdCase.state === 'Pending' || session.form.ccdCase.state === 'PAAppCreated' || session.form.ccdCase.state === 'CasePaymentFailed') {
                    res.redirect('/task-list');
                } else {
                    res.redirect('/thank-you');
                }
            })
            .catch(err => {
                logger.error(`Error while getting the case: ${err}`);
                res.redirect('/errors/404');
            });
    } else {
        res.redirect('/dashboard');
    }
};

const getDeclarationStatuses = (req, res, next) => {
    const session = req.session;
    const formdata = session.form;
    const executorsWrapper = new ExecutorsWrapper(formdata.executors);
    const hasMultipleApplicants = executorsWrapper.hasMultipleApplicants();

    if ((get(formdata, 'declaration.declarationCheckbox', false)).toString() === 'true' && hasMultipleApplicants) {
        const ccdCaseId = formdata.ccdCase.id;

        const formData = ServiceMapper.map(
            'FormData',
            [config.services.orchestrator.url, req.sessionID]
        );

        formData.getDeclarationStatuses(req.authToken, req.session.serviceAuthorization, ccdCaseId)
            .then(result => {
                session.form.executorsDeclarations = [];

                if (result.invitations && result.invitations.length) {
                    session.form.executorsDeclarations = result.invitations.map(executor => {
                        let agreed;

                        if (executor.agreed === null) {
                            agreed = 'notDeclared';
                        } else if (executor.agreed) {
                            agreed = 'agreed';
                        } else {
                            agreed = 'disagreed';
                        }

                        return {
                            executorName: executor.executorName,
                            agreed: agreed
                        };
                    });
                }

                next();
            })
            .catch(err => {
                logger.error(`Error while getting the declaration statuses: ${err}`);
            });
    } else {
        next();
    }
};

const cleanupSession = (session, retainCaseType = false) => {
    const retainedList = [
        'applicantEmail',
        'payloadVersion',
        'userLoggedIn'
    ];
    if (retainCaseType) {
        retainedList.push('caseType');
    }
    Object.keys(session.form).forEach((key) => {
        if (!retainedList.includes(key)) {
            delete session.form[key];
        }
    });
};

module.exports.initDashboard = initDashboard;
module.exports.getCase = getCase;
module.exports.getDeclarationStatuses = getDeclarationStatuses;
