'use strict';

const ServiceAuthoriser = require('app/utils/ServiceAuthoriser');
const config = require('app/config');

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
