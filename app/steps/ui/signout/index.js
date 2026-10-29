'use strict';

const Step = require('app/core/steps/Step');
const config = require('config');
const logger = require('app/components/logger')('Init');
const SECURITY_COOKIE = `__auth-token-${config.payloadVersion}`;
const EXPRESS_SESSION_COOKIE = config.redis?.cookie?.name || 'connect.sid';
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
        const sessionConcurrency = new SessionConcurrency({
            redisEnabled: config.redis && config.redis.enabled,
            sessionTtl: config.app && config.app.session && config.app.session.ttl
        });
        const userKey = req.session && req.session.idamUserId;
        const sessionId = req.sessionID;
        const finalizeLocalSignOut = () => {
            return sessionConcurrency
                .clearIfCurrent(req.sessionStore, userKey, sessionId)
                .catch(err => {
                    logger.error(`Unable to clear active session mapping on sign-out (${this._safeErrorType(err)}).`);
                })
                .then(() => new Promise(resolve => {
                    if (req.session && typeof req.session.destroy === 'function') {
                        req.session.destroy(err => {
                            if (err) {
                                logger.error(`Unable to destroy local session on sign-out (${this._safeErrorType(err)}).`);
                            }
                            resolve();
                        });
                        return;
                    }
                    resolve();
                }))
                .finally(() => {
                    res.clearCookie(SECURITY_COOKIE);
                    res.clearCookie(EXPRESS_SESSION_COOKIE);
                    delete req.cookies;
                    delete req.sessionID;
                    delete req.session;
                    delete req.sessionStore;
                });
        };

        return idamSession.delete(access_token)
            .then(result => {
                if (errorCodes.includes(result)) {
                    throw new Error('Error while attempting to sign out of IDAM.');
                }
            })
            .catch(err => {
                logger.error(`Error while calling IDAM (${this._safeErrorType(err)}).`);
            })
            .finally(() => finalizeLocalSignOut())
            .then(() => ctx);
    }

    _safeErrorType(err) {
        if (err && typeof err === 'object' && err.name) {
            return err.name;
        }
        return 'Error';
    }

    shouldHaveBackLink() {
        return false;
    }
}

module.exports = SignOut;
