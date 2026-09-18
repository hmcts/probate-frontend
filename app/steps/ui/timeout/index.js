'use strict';

const Step = require('app/core/steps/Step');
const config = require('config');
const logger = require('app/components/logger')('Init');
const SessionConcurrency = require('app/services/SessionConcurrency');

class Timeout extends Step {

    static getUrl () {
        return '/time-out';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const sessionConcurrency = new SessionConcurrency(config.app.sessionConcurrency);
        const userKey = req.session && req.session.regId;
        const sessionId = req.sessionID;

        sessionConcurrency
            .clearActiveSessionIdIfCurrent(req.sessionStore, userKey, sessionId)
            .catch(err => {
                logger.error(`Unable to clear active session mapping on timeout: ${err}`);
            });

        req.session.destroy();
        delete req.cookies;
        delete req.sessionID;
        delete req.session;
        delete req.sessionStore;

        return ctx;
    }

    shouldHaveBackLink() {
        return false;
    }
}

module.exports = Timeout;
