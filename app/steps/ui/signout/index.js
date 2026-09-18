'use strict';

const Step = require('app/core/steps/Step');
const config = require('config');
const logger = require('app/components/logger')('Init');
const SECURITY_COOKIE = `__auth-token-${config.payloadVersion}`;
const IdamSession = require('app/services/IdamSession');
const SessionConcurrency = require('app/services/SessionConcurrency');

class SignOut extends Step {

    static getUrl () {
        return '/sign-out';
    }

    getContextData(req, res) {
        const ctx = super.getContextData(req);
        ctx.authToken = req.authToken;
        const access_token = req.cookies[SECURITY_COOKIE];
        const errorCodes = [400, 401, 403];
        const idamSession = new IdamSession(config.services.idam.apiUrl, req.sessionID);
        const sessionConcurrency = new SessionConcurrency(config.app.sessionConcurrency);
        const userKey = req.session && req.session.regId;
        const sessionId = req.sessionID;

        return idamSession.delete(access_token)
            .then(result => {
                if (errorCodes.includes(result)) {
                    throw new Error('Error while attempting to sign out of IDAM.');
                }

                return sessionConcurrency
                    .clearActiveSessionIdIfCurrent(req.sessionStore, userKey, sessionId)
                    .catch(err => {
                        logger.error(`Unable to clear active session mapping on sign-out: ${err}`);
                    })
                    .finally(() => {
                        req.session.destroy();
                        res.clearCookie(SECURITY_COOKIE);
                        delete req.cookies;
                        delete req.sessionID;
                        delete req.session;
                        delete req.sessionStore;
                    })
                    .then(() => ctx);
            })
            .catch(err => {
                logger.error(`Error while calling IDAM: ${err}`);
            });
    }

    shouldHaveBackLink() {
        return false;
    }
}

module.exports = SignOut;
