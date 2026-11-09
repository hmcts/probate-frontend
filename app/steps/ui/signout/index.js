'use strict';

const Step = require('app/core/steps/Step');
const config = require('config');
const logger = require('app/components/logger')('Init');
const IDAM_ACCESS_TOKEN_COOKIE = `__auth-token-${config.payloadVersion}`;
const EXPRESS_SESSION_COOKIE = config.redis?.cookie?.name || 'connect.sid';
const IdamSession = require('app/services/IdamSession');
const SessionConcurrency = require('app/services/SessionConcurrency');
const SessionCleanupOutcomeEnum = require('app/utils/SessionCleanupOutcomeEnum');
const URL = require('url');

class SignOut extends Step {

    static getUrl () {
        return '/sign-out';
    }

    getContextData(req, res) {
        const ctx = super.getContextData(req);
        ctx.authToken = req.authToken;
        const idamAccessToken = req.cookies?.[IDAM_ACCESS_TOKEN_COOKIE];
        const idamSession = new IdamSession(config.services.idam.apiUrl, req.sessionID);
        const sessionConcurrency = new SessionConcurrency({
            singleActiveSessionEnabled: config.singleActiveSession && config.singleActiveSession.enabled,
            mappingTtl: config.singleActiveSession && config.singleActiveSession.mappingTtl,
            redisEnabled: config.redis && config.redis.enabled,
        });
        const buildFailureSuffix = err => {
            const status = err && Number.isInteger(err.status) ? err.status : null;
            const statusCode = err && Number.isInteger(err.statusCode) ? err.statusCode : null;
            const numericCode = err && Number.isInteger(err.code) ? err.code : null;
            if (status !== null) {
                return ` (status: ${status})`;
            }
            if (statusCode !== null) {
                return ` (statusCode: ${statusCode})`;
            }
            if (numericCode !== null) {
                return ` (code: ${numericCode})`;
            }
            return '';
        };
        const idamUserId = req.session && req.session.idamUserId;
        const sessionId = req.sessionID;
        const logLifecycle = (eventName, additionalFields = {}) => {
            let selectedPath = '/';
            if (typeof req.originalUrl === 'string') {
                selectedPath = req.originalUrl;
            } else if (typeof req.path === 'string') {
                selectedPath = req.path;
            }
            const requestPath = URL.parse(selectedPath).pathname || '/';
            const requestMethod = req.method;
            const fields = Object.assign({event: eventName, requestMethod, requestPath}, additionalFields);
            logger.info(Object.entries(fields).map(([key, value]) => `${key}=${value}`).join(' '));
        };

        logLifecycle('manual_sign_out_started');
        const finalizeLocalSignOut = () => {
            return sessionConcurrency
                // Older-browser sign-out must not remove ownership that a newer browser session now holds.
                .clearCurrentOwnerMappingOnSessionMatch(req.sessionStore, idamUserId, sessionId)
                .then(result => {
                    const ownershipMappingCleanupOutcome = Number(result) === 1
                        ? SessionCleanupOutcomeEnum.getCompleted()
                        : SessionCleanupOutcomeEnum.getSkipped();
                    logLifecycle('ownership_mapping_cleanup_result', {ownershipMappingCleanupOutcome});
                })
                .catch(err => {
                    logger.error(`Redis ownership cleanup failed during sign-out; continuing local sign-out${buildFailureSuffix(err)}.`);
                    logLifecycle('ownership_mapping_cleanup_result', {
                        ownershipMappingCleanupOutcome: SessionCleanupOutcomeEnum.getFailed()
                    });
                })
                .then(() => new Promise(resolve => {
                    // The server session may already be missing; continue local sign-out cleanup either way.
                    if (req.session && typeof req.session.destroy === 'function') {
                        req.session.destroy(err => {
                            if (err) {
                                logger.error(`Express session destruction failed during sign-out; continuing cookie cleanup${buildFailureSuffix(err)}.`);
                            }
                            resolve();
                        });
                        return;
                    }
                    resolve();
                }))
                .finally(() => {
                    res.clearCookie(IDAM_ACCESS_TOKEN_COOKIE);
                    res.clearCookie(EXPRESS_SESSION_COOKIE);
                    delete req.cookies;
                    delete req.sessionID;
                    delete req.session;
                    delete req.sessionStore;
                    logLifecycle('local_sign_out_completed');
                });
        };

        const idamSignOutPromise = idamAccessToken
            ? (() => {
                logLifecycle('remote_idam_sign_out_attempted');
                return idamSession.delete(idamAccessToken)
                    .then(result => {
                        // AsyncFetch can resolve failures as Error values, so throw them into the shared failure/cleanup path.
                        const isErrorResult = result instanceof Error
                            || (result && typeof result === 'object' && result.name === 'Error');
                        if (isErrorResult) {
                            throw result;
                        }
                    });
            })()
            : Promise.resolve();
        return idamSignOutPromise
            .catch(err => {
                logger.error(`Remote IDAM sign-out failed; continuing local sign-out${buildFailureSuffix(err)}.`);
            })
            .finally(() => finalizeLocalSignOut())
            .then(() => ctx);
    }

    shouldHaveBackLink() {
        return false;
    }
}

module.exports = SignOut;
