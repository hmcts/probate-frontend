'use strict';

const Step = require('app/core/steps/Step');
const config = require('app/config');
const logger = require('app/components/logger')('Init');
const services = require('app/components/services');
const SECURITY_COOKIE = `__auth-token-${config.payloadVersion}`;

class SignOut extends Step {

    static getUrl () {
        return '/sign-out';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const access_token = req.cookies[SECURITY_COOKIE];
        const errorCodes = [400, 401, 403];

        return services.signOut(access_token).then(result => {
            if (errorCodes.includes(result)) {
                throw new Error('Error while attempting to sign out of IDAM.');
            }

            req.session.destroy();
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
