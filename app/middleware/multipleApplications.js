'use strict';

const {get, sortBy} = require('lodash');
const config = require('config');
const logger = require('app/components/logger')('Init');
const ServiceMapper = require('app/utils/ServiceMapper');
const caseTypes = require('app/utils/CaseTypes');
const ExecutorsWrapper = require('app/wrappers/Executors');

const initDashboard = (req, res, next) => {
    const session = req.session;
    const formdata = session.form;
    const formData = ServiceMapper.map(
        'FormData',
        [config.services.orchestrator.url, req.sessionID]
    );

    formData.getAll(req.authToken, req.session.serviceAuthorization)
        .then(result => {
            if (result.applications && result.applications.length) {
                logger.info('Retrieved Cases = ' + JSON.stringify(result.applications));
                if (allEligibilityQuestionsPresent(formdata)) {
                    if (!result.applications.some(application => application.ccdCase.state === 'Pending' && !application.deceasedFullName && application.caseType === caseTypes.getProbateType(formdata.caseType))) {
                        createNewApplication(req, res, formdata, formData, result, next);
                    } else {
                        delete formdata.caseType;
                        delete formdata.screeners;
                        renderDashboard(req, result, next);
                    }
                } else {
                    delete formdata.caseType;
                    delete formdata.screeners;
                    renderDashboard(req, result, next);
                }
            } else if (allEligibilityQuestionsPresent(formdata)) {
                createNewApplication(req, res, formdata, formData, result, next);
            } else {
                res.redirect('/start-eligibility');
            }
        })
        .catch(err => {
            logger.error(`Error while getting applications: ${err}`);
        });
};

const createNewApplication = (req, res, formdata, formData, result, next) => {
    cleanupSession(req.session, true);

    formData.postNew(req.authToken, req.session.serviceAuthorization, req.session.form.caseType)
        .then(result => {
            logger.info('Retrieved cases after new case created = ' + JSON.stringify(result.applications));
            delete formdata.caseType;
            delete formdata.screeners;
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
        if (formdata.screeners.left === 'optionNo') {
            eligibilityQuestionsList = config.eligibilityQuestionsIntestacy;
        } else if (formdata.screeners.deathCertificateInEnglish === 'optionYes') {
            eligibilityQuestionsList = config.eligibilityQuestionsProbateEnglishDeathCert;
        } else if (formdata.screeners.deathCertificateInEnglish === 'optionNo') {
            eligibilityQuestionsList = config.eligibilityQuestionsProbateTranslatedDeathCert;
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
    delete req.session.form.caseType;
    delete req.session.form.screeners;

    if (result.applications && result.applications.length) {
        cleanupSession(req.session);
    }

    logger.info('Dashboard Cases = ' + JSON.stringify(result.applications));
    req.session.form.applications = sortBy(result.applications, 'ccdCase.id');
    next();
};

const getCase = (req, res, next, checkDeclarationStatuses) => {
    const session = req.session;
    const redirectingFromDashboard = req.originalUrl !== '/task-list';
    let ccdCaseId;
    let probateType;

    if (redirectingFromDashboard) {
        ccdCaseId = req.originalUrl.split('/')[2];
        if (ccdCaseId) {
            ccdCaseId = ccdCaseId.split('?')[0];
        }

        probateType = req.originalUrl.split('/')[2];
        if (probateType) {
            probateType = probateType.split('?')[1];

            if (probateType) {
                probateType = probateType.split('=')[1];
            }
        }
    } else {
        ccdCaseId = req.session.form.ccdCase.id;
    }

    logger.info(`Current Case = ${ccdCaseId}`);
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
                if (redirectingFromDashboard) {
                    session.form = result;
                    res.redirect('/task-list');
                } else {
                    if (checkDeclarationStatuses) {
                        session.form = populateDeclarationFlags(result, session.form);
                    }
                    next();
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
    const formdata = req.session.form;
    const executorsWrapper = new ExecutorsWrapper(formdata.executors);
    const hasMultipleApplicants = executorsWrapper.hasMultipleApplicants();

    if ((get(formdata, 'declaration.declarationCheckbox', false)).toString() === 'true' && hasMultipleApplicants) {
        getCase(req, res, next, true);
    } else {
        next();
    }
};

const populateDeclarationFlags = (result, formdata) => {
    formdata.executorsDeclarations = [];

    result.executors.list
        .forEach((executor, index) => {
            if (!executor.isApplicant && executor.isApplying) {
                const executorAgreed = get(executor, 'executorAgreed', null);
                let agreed;
                if (executorAgreed === null) {
                    agreed = 'notDeclared';
                } else {
                    formdata.executors.list[index].executorAgreed = executorAgreed;
                    agreed = executorAgreed === 'optionYes' ? 'agreed' : 'disagreed';
                }
                formdata.executorsDeclarations.push({
                    executorName: executor.fullName,
                    agreed: agreed
                });
            }
        });

    return formdata;
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
