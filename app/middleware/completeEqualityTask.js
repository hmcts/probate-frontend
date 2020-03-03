'use strict';

const config = require('app/config');
const ServiceMapper = require('app/utils/ServiceMapper');
const uuidv4 = require('uuid/v4');

const completeEqualityTask = (req, res, next) => {
    const formData = ServiceMapper.map(
        'FormData',
        [config.services.orchestrator.url, req.sessionID]
    );

    req.session.form.equality = {
        pcqId: uuidv4()
    };

    formData.post(req.authToken, req.session.serviceAuthorization, req.session.form.ccdCase.id, req.session.form);

    next();
};

module.exports = completeEqualityTask;
