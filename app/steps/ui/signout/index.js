'use strict';

const Step = require('app/core/steps/Step');
const config = require('config');
const logger = require('app/components/logger')('Init');
const SECURITY_COOKIE = `__auth-token-${config.payloadVersion}`;
const IdamSession = require('app/services/IdamSession');

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

        return idamSession.delete(access_token)
            .then(result => {
                if (errorCodes.includes(result)) {
                    throw new Error('Error while attempting to sign out of IDAM.');
                }

                req.session.destroy();
                res.clearCookie(SECURITY_COOKIE);
                delete req.cookies;
                delete req.sessionID;
                delete req.session;
                delete req.sessionStore;

                return ctx;
            })
            .catch(err => {
                logger.error(`Error while calling IDAM: ${err}`);
            });
    }

}

module.exports = SignOut;
