'use strict';

const {get, forEach} = require('lodash');
const config = require('app/config');
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

    if (formdata.screeners) {
        cleanupFormdata(req.session.form, true);

        formData.postNew(req.authToken, req.session.serviceAuthorization, req.session.form.caseType)
            .then(result => renderDashboard(req, result, next))
            .catch(err => {
                logger.error(`Error while getting applications: ${err}`);
            });
    } else {
        formData.getAll(req.authToken, req.session.serviceAuthorization)
            .then(result => renderDashboard(req, result, next))
            .catch(err => {
                logger.error(`Error while getting applications: ${err}`);
            });
    }
};

const renderDashboard = (req, result, next) => {
    if (result.applications && result.applications.length) {
        cleanupFormdata(req.session.form);
    }

    req.session.form.applications = result.applications;
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

                if (session.form.ccdCase.state === 'Draft' || session.form.ccdCase.state === 'PAAppCreated' || session.form.ccdCase.state === 'CasePaymentFailed') {
                    res.redirect('/task-list');
                } else {
                    res.redirect('/thank-you');
                }
            })
            .catch(err => {
                logger.error(`Error while getting the case: ${err}`);
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

    if (get(formdata, 'declaration.declarationCheckbox') && hasMultipleApplicants) {
        const ccdCaseId = formdata.ccdCase.id;

        const formData = ServiceMapper.map(
            'FormData',
            [config.services.orchestrator.url, req.sessionID]
        );

        formData.getDeclarationStatuses(req.authToken, req.session.serviceAuthorization, ccdCaseId)
            .then(result => {
                session.form.executorsDeclarations = [];
                forEach(result, executor => (
                    session.form.executorsDeclarations.push({
                        executorName: executor.executorName,
                        agreed: executor.agreed
                    })
                ));

                next();
            })
            .catch(err => {
                logger.error(`Error while getting the declaration statuses: ${err}`);
            });
    } else {
        next();
    }
};

const cleanupFormdata = (formdata, retainCaseType = false) => {
    const retainedList = [
        'applicantEmail',
        'payloadVersion',
        'userLoggedIn'
    ];
    if (retainCaseType) {
        retainedList.push('caseType');
    }
    Object.keys(formdata).forEach((key) => {
        if (!retainedList.includes(key)) {
            delete formdata[key];
        }
    });
};

module.exports.initDashboard = initDashboard;
module.exports.getCase = getCase;
module.exports.getDeclarationStatuses = getDeclarationStatuses;
