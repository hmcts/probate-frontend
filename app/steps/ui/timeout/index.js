'use strict';

const Step = require('app/core/steps/Step');
const config = require('app/config');
const logger = require('app/components/logger')('Init');
const services = require('app/components/services');
const SECURITY_COOKIE = `__auth-token-${config.payloadVersion}`;

class Timeout extends Step {

    static getUrl () {
        return '/time-out';
    }

    getContextData(req) {
        req.session.destroy();
        delete req.cookies;
        delete req.sessionID;
        delete req.session;
        delete req.sessionStore;
    }
}

module.exports = Timeout;
