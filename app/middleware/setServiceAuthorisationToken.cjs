'use strict';

const ServiceAuthoriser = require('app/utils/ServiceAuthoriser.cjs');
const config = require('config');

const setServiceAuthorisationToken = (req, res, next) => {
    const session = req.session;
    const serviceAuthoriser = new ServiceAuthoriser(config.services.idam.s2s_url, session.id);
    serviceAuthoriser.determineServiceAuthorizationToken()
        .then((token) => {
            req.session.serviceAuthorization = token;
            next();
        });
};

module.exports = setServiceAuthorisationToken;
