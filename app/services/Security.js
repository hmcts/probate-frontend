'use strict';

const AsyncFetch = require('app/utils/AsyncFetch');
const config = require('config');
const logger = require('app/components/logger')('Init');
const {URLSearchParams} = require('url');
const FormatUrl = require('app/utils/FormatUrl');
const loggerRaw = require('app/components/logger');
const URL = require('url');
const {v4: UUID} = require('uuid');
const IdamSession = require('app/services/IdamSession');
const Oauth2Token = require('app/services/Oauth2Token');
const SessionConcurrency = require('app/services/SessionConcurrency');
const SessionStatusEnum = require('app/utils/SessionStatusEnum');
const SessionOwnershipStatusEnum = require('app/utils/SessionOwnershipStatusEnum');
const SessionCleanupOutcomeEnum = require('app/utils/SessionCleanupOutcomeEnum');
const IDAM_ACCESS_TOKEN_COOKIE = `__auth-token-${config.payloadVersion}`;
const EXPRESS_SESSION_COOKIE = config.redis?.cookie?.name || 'connect.sid';
const REDIRECT_COOKIE = '__redirect';
const NodeCache = require('node-cache');

class Security {
    constructor(loginUrl) {
        if (String(config.services.idam.caching) === 'true') {
            this.idamDetailsCache = new NodeCache({stdTTL: 3600, checkperiod: 1800});
        }
        if (loginUrl) {
            this.loginUrl = loginUrl;
        }
        this.sessionConcurrency = new SessionConcurrency({
            singleActiveSessionEnabled: config.singleActiveSession && config.singleActiveSession.enabled,
            mappingTtl: config.singleActiveSession && config.singleActiveSession.mappingTtl,
            redisEnabled: config.redis && config.redis.enabled,
        });
    }

    protectAuthenticatedRoute(authorisedRoles) {
        return (req, res, next) => {
            req.log = loggerRaw(req.sessionID);

            const idamAccessToken = req.cookies?.[IDAM_ACCESS_TOKEN_COOKIE];

            // Without an IDAM auth cookie this request cannot prove authentication, so restart sign-in.
            if (!idamAccessToken) {
                this._logLifecycle(req, 'normal_sign_in_started', {reason: 'missing_idam_access_token_cookie'});
                this._redirectToIdamSignIn(req, res);
                return false;
            }

            const expressSessionStatus = this._getExpressSessionStatus(req);
            // EXPIRED means a genuine inactivity timeout, so route to /time-out.
            if (expressSessionStatus === SessionStatusEnum.getExpired()) {
                this._logLifecycle(req, 'session_gate_triggered', {expressSessionStatus: SessionStatusEnum.getExpired()});
                return this._redirectToTimeout(req, res);
            }
            // LOST means server-side authentication cannot be proven and must reauthenticate before any handler runs.
            if (expressSessionStatus === SessionStatusEnum.getLost()) {
                this._logLifecycle(req, 'session_gate_triggered', {expressSessionStatus: SessionStatusEnum.getLost()});
                req.log.error('The current user session is LOST, redirecting user to login for reauthentication.');
                return this._reauthenticateUser(req, res);
            }
            if (expressSessionStatus === SessionStatusEnum.getActive()) {
                // ACTIVE only allows continued checks; identity, ownership and role authorisation still decide access.
                return this._authoriseActiveSessionRequest(req, res, next, idamAccessToken, authorisedRoles);
            }

            return next(new Error(`Unexpected express-session status "${expressSessionStatus}" during request authorisation.`));
        };
    }

    guardPublicScreenerSession() {
        return (req, res, next) => {
            req.log = loggerRaw(req.sessionID);

            const idamAccessToken = req.cookies?.[IDAM_ACCESS_TOKEN_COOKIE];
            // Distinguish displaced authenticated browsers from anonymous screener users so eligibility stays public.
            if (!idamAccessToken) {
                return next();
            }

            const expressSessionStatus = this._getExpressSessionStatus(req);
            if (expressSessionStatus === SessionStatusEnum.getLost()) {
                this._logLifecycle(req, 'session_gate_triggered', {expressSessionStatus: SessionStatusEnum.getLost()});
                req.log.error('The current user session is LOST, redirecting user to login for reauthentication.');
                return this._reauthenticateUser(req, res);
            }

            return next();
        };
    }

    _authoriseActiveSessionRequest(req, res, next, idamAccessToken, authorisedRoles) {
        return this._getIdamDetails(req, res, idamAccessToken)
            .then(idamDetails => {
                // A null result means the request was already redirected to normal sign-in.
                if (!idamDetails) {
                    return false;
                }
                // Active Express state is insufficient until IDAM identity, Redis ownership and role checks all pass.
                return this._getSessionOwnershipStatus(req)
                    .then(sessionOwnershipStatus => {
                        if (sessionOwnershipStatus === SessionOwnershipStatusEnum.getCurrent()
                            || sessionOwnershipStatus === SessionOwnershipStatusEnum.getNotEnforced()) {
                            // Reaching this point means identity and ownership checks passed, so role auth can decide access.
                            if (this._hasAuthorisedRole(idamDetails.roles, authorisedRoles)) {
                                next();
                                return true;
                            }
                            loggerRaw().error('[ERROR] :: Error authorising user, Role Not Authorised');
                            this._denyAccess(req, res);
                            return false;
                        }

                        if (sessionOwnershipStatus === SessionOwnershipStatusEnum.getSuperseded()) {
                            this._logLifecycle(req, 'session_ownership_reauthentication', {ownershipStatus: SessionOwnershipStatusEnum.getSuperseded()});
                            req.log.error('Session ownership status is SUPERSEDED, redirecting user to login for reauthentication.');
                            return this._reauthenticateUser(req, res);
                        }

                        if (sessionOwnershipStatus === SessionOwnershipStatusEnum.getUnverifiable()) {
                            this._logLifecycle(req, 'session_ownership_reauthentication', {ownershipStatus: SessionOwnershipStatusEnum.getUnverifiable()});
                            req.log.error('Session ownership status is UNVERIFIABLE, redirecting user to login for reauthentication.');
                            return this._reauthenticateUser(req, res);
                        }

                        return next(new Error(`Unexpected session ownership status "${sessionOwnershipStatus}" during request authorisation.`));
                    });
            })
            // Unexpected dependency failures should use existing technical-error handling via next(error).
            .catch(next);
    }

    _storeAuthenticatedUserInSession(req, idamDetails, idamAccessToken = req.cookies[IDAM_ACCESS_TOKEN_COOKIE]) {
        req.session.expires = Date.now() + config.app.session.expires;
        req.session.regId = idamDetails.email;
        req.session.idamUserId = idamDetails.id;
        req.userId = idamDetails.id;
        req.authToken = idamAccessToken;
        req.session.authToken = req.authToken;
    }

    _getExpressSessionStatus(req) {
        // Missing expiry marker is treated as LOST because server-side authentication state cannot be proved.
        if (!req.session || !req.session.expires) {
            return SessionStatusEnum.getLost();
        }
        // Elapsed expiry is EXPIRED inactivity and routes to /time-out.
        if (req.session.expires <= Date.now()) {
            return SessionStatusEnum.getExpired();
        }
        return SessionStatusEnum.getActive();
    }

    _redirectToTimeout(req, res) {
        req.log.error('The current user session is EXPIRED, redirecting user to the time-out page.');
        // Inactivity timeout ends the authenticated browser session, so clear both IDAM auth and connect.sid cookies.
        res.clearCookie(IDAM_ACCESS_TOKEN_COOKIE);
        res.clearCookie(EXPRESS_SESSION_COOKIE);
        // Destroy persisted Express session when supported; otherwise continue with in-memory cleanup only.
        if (typeof req.session.destroy === 'function') {
            req.session.destroy();
        }
        delete req.cookies;
        delete req.sessionID;
        delete req.session;
        delete req.sessionStore;
        this._logLifecycle(req, 'timeout_redirect_issued', {expressSessionStatus: SessionStatusEnum.getExpired()});
        return res.redirect('/time-out');
    }

    _getIdamDetails(req, res, idamAccessToken) {
        const cachedIdamDetails = this.idamDetailsCache && req.session.regId && this.idamDetailsCache.get(req.session.regId);
        if (cachedIdamDetails) {
            console.log('Using cache...');
            this._storeAuthenticatedUserInSession(req, cachedIdamDetails);
            return Promise.resolve(cachedIdamDetails);
        }

        const idamSession = new IdamSession(config.services.idam.apiUrl, req.sessionID);
        return idamSession
            .get(idamAccessToken)
            .then(idamDetails => {
                if (idamDetails.name === 'Error') {
                    req.log.error('Error authorising user');
                    req.log.error(`Error ${JSON.stringify(idamDetails)} \n`);
                    // IDAM Unauthorized should restart normal sign-in flow, not be treated as role-based 403.
                    if (idamDetails.message === 'Unauthorized') {
                        this._redirectToIdamSignIn(req, res);
                        return null;
                    }
                    throw idamDetails;
                }
                req.log.debug('Extending session for active user.');
                this._storeAuthenticatedUserInSession(req, idamDetails);
                if (this.idamDetailsCache) {
                    console.log('Setting cache...');
                    this.idamDetailsCache.set(req.session.regId, idamDetails);
                }
                return idamDetails;
            });
    }

    _getSessionOwnershipStatus(req) {
        const idamUserId = req.session.idamUserId;
        const requestSessionId = req.sessionID;
        return this.sessionConcurrency.validateCurrentOwnerAndRefreshTtl(req.sessionStore, idamUserId, requestSessionId);
    }

    _reauthenticateUser(req, res) {
        // Capture language and token before local cleanup so reauthentication can resume with the right context.
        const language = req.session && req.session.language ? req.session.language : 'en';
        const idamAccessToken = req.cookies && req.cookies[IDAM_ACCESS_TOKEN_COOKIE];
        const idamSession = new IdamSession(config.services.idam.apiUrl, req.sessionID);
        const destroyLocalExpressSession = () => new Promise(resolve => {
            if (req.session && typeof req.session.destroy === 'function') {
                req.session.destroy(err => {
                    if (err) {
                        req.log.error(`Unable to destroy superseded local session.${this._buildNumericFailureSuffix(err)}`);
                        resolve(SessionCleanupOutcomeEnum.getFailed());
                        return;
                    }
                    resolve(SessionCleanupOutcomeEnum.getCompleted());
                });
                return;
            }
            resolve(SessionCleanupOutcomeEnum.getSkipped());
        });

        const cleanupLocalAuthenticationState = () => {
            res.clearCookie(IDAM_ACCESS_TOKEN_COOKIE);
            res.clearCookie(EXPRESS_SESSION_COOKIE);
            delete req.authToken;
            delete req.userId;
            delete req.cookies;
            delete req.sessionID;
            delete req.session;
            delete req.sessionStore;
        };

        // Remote invalidation may fail, but local session/cookie cleanup always completes before redirecting to IDAM sign-in.
        let idamInvalidationPromise = Promise.resolve();
        if (idamAccessToken) {
            this._logLifecycle(req, 'remote_idam_invalidation_attempted');
            idamInvalidationPromise = idamSession.delete(idamAccessToken)
                .then(result => {
                    // AsyncFetch can resolve failures as Error values, so throw them into the existing safe failure path.
                    const isErrorResult = result instanceof Error
                        || (result && typeof result === 'object' && result.name === 'Error');
                    if (isErrorResult) {
                        throw result;
                    }
                })
                .catch(err => {
                    req.log.error(`Unable to invalidate stale IDAM session token.${this._buildNumericFailureSuffix(err)}`);
                });
        }

        return idamInvalidationPromise
            .then(() => destroyLocalExpressSession()
                .finally(() => {
                    cleanupLocalAuthenticationState();
                }))
            .then(expressSessionDestructionOutcome => {
                this._logLifecycle(req, 'forced_reauthentication_local_authentication_state_cleared', {
                    localAuthenticationStateCleared: true,
                    expressSessionDestructionOutcome
                });
                // Restart normal sign-in only after local cleanup has completed.
                this._redirectToIdamSignIn(req, res, language);
                return false;
            });
    }

    _redirectToIdamSignIn(req, res, language = req.session && req.session.language ? req.session.language : 'en') {
        const state = this._generateState();
        let returnUrl = FormatUrl.createHostname(req);
        if (req.baseUrl.indexOf('get-case') > 0) {
            returnUrl += req.originalUrl;
        }
        this._setRedirectCookie(req, res, returnUrl, state);
        const idamConfig = config.services.idam;

        const callbackUrl = FormatUrl.format(returnUrl, idamConfig.probate_oauth_callback_path);
        const redirectUrl = URL.parse(this.loginUrl, true);
        redirectUrl.query.ui_locales = language;
        redirectUrl.query.response_type = 'code';
        redirectUrl.query.state = state;
        redirectUrl.query.client_id = idamConfig.probate_oauth2_client;
        redirectUrl.query.redirect_uri = callbackUrl;

        // Forced sign-in after a form POST uses 303 so the browser performs a fresh GET to IDAM instead of staying on stale POST content.
        const redirectStatus = req.method === 'POST' ? 303 : 302;
        this._logLifecycle(req, 'idam_sign_in_redirect_issued', {redirectStatus, redirectTarget: 'idam_login'});
        res.redirect(redirectStatus, redirectUrl.format());
    }

    _hasAuthorisedRole(userRoles, authorisedRoles) {
        return Boolean(userRoles?.some(role => authorisedRoles.includes(role)));
    }

    _denyAccess(req, res) {
        const commonContent = require(`app/resources/${req.session.language}/translation/common`);
        const content = require(`app/resources/${req.session.language}/translation/errors/403`);

        res.clearCookie(IDAM_ACCESS_TOKEN_COOKIE);
        res.status(403);
        res.render('errors/error', {common: commonContent, content: content, error: '403', userLoggedIn: false});
    }

    _generateState() {
        return UUID();
    }

    handleIdamOAuthCallback() {
        return (req, res, next) => {
            const redirectInfo = this._getRedirectCookie(req);
            req.log = loggerRaw(req.sessionID);

            // Missing callback context cannot be trusted, so restart the normal sign-in journey.
            if (!redirectInfo) {
                req.log.error('Redirect cookie is missing');
                this._redirectToIdamSignIn(req, res);
            // Callback without an authorisation code is incomplete and must restart sign-in.
            } else if (!req.query.code) {
                req.log.warn('No code received');
                this._redirectToIdamSignIn(req, res);
            } else if (redirectInfo.state !== req.query.state) {
                // State mismatch indicates an untrusted callback response, so fail closed to access-denied.
                req.log.error(`States do not match: ${redirectInfo.state} is not ${req.query.state}`);
                this._denyAccess(req, res);
            } else {
                return this._establishAuthenticatedSession(req, res, redirectInfo).catch(next);
            }
        };
    }

    _establishAuthenticatedSession(req, res, redirectInfo) {
        return this._getTokenFromCode(req)
            .then(tokenExchangeResult => {
                if (tokenExchangeResult.name === 'Error') {
                    req.log.error('Error while getting the access token');
                    // Only recognised IDAM authentication rejection restarts sign-in; unexpected failures propagate.
                    if (tokenExchangeResult.message === 'Unauthorized') {
                        this._redirectToIdamSignIn(req, res);
                        return null;
                    }
                    throw tokenExchangeResult;
                }

                const idamAccessToken = tokenExchangeResult.access_token;
                const idamSession = new IdamSession(config.services.idam.apiUrl, req.sessionID);
                return idamSession.get(idamAccessToken)
                    .then(idamDetails => {
                        if (idamDetails.name === 'Error') {
                            req.log.error('Error authorising user in callback');
                            // Recognised callback-session expiry restarts sign-in; other IDAM errors propagate unchanged.
                            if (idamDetails.message === 'Unauthorized') {
                                this._redirectToIdamSignIn(req, res);
                                return null;
                            }
                            throw idamDetails;
                        }

                        // Missing immutable ID means the callback cannot establish a valid authenticated owner.
                        if (!idamDetails.id) {
                            throw new Error('IDAM details response did not include a user ID.');
                        }

                        // Only a completed IDAM login may replace Redis owner mapping for this user.
                        this._storeAuthenticatedUserInSession(req, idamDetails, idamAccessToken);
                        // Replace owner mapping before old-session destruction to prevent stale-request reclaim.
                        return this.sessionConcurrency
                            .activateLatestSession(req.sessionStore, req.session.idamUserId, req.sessionID)
                            .then(activationResult => {
                                const ownershipStatus = activationResult.ownershipStatus;
                                const previousSessionReplaced = Boolean(activationResult && activationResult.previousSessionId);
                                this._logLifecycle(req, 'authenticated_login_completed', {
                                    ownershipStatus,
                                    previousSessionReplaced
                                });
                                // Keep the new owner mapping even if old-session destruction fails, then log for support visibility.
                                if (activationResult && activationResult.destroyError) {
                                    req.log.error('Unable to destroy previous active session.');
                                }
                            })
                            .then(() => {
                                // Auth cookie issuance follows callback ownership handling; disabled enforcement intentionally leaves Redis ownership unchanged.
                                this._setCookie(res, IDAM_ACCESS_TOKEN_COOKIE, idamAccessToken);
                                res.clearCookie(REDIRECT_COOKIE);
                                res.redirect(redirectInfo.continue_url);
                                return null;
                            });
                    });
            });
    }

    _getTokenFromCode(req) {
        const hostname = FormatUrl.createHostname(req);
        const redirectUri = FormatUrl.format(hostname, config.services.idam.probate_oauth_callback_path);
        const oauth2Token = new Oauth2Token(config.services.idam.apiUrl, req.sessionID);
        return oauth2Token.post(req.query.code, redirectUri);
    }

    _getRedirectCookie(req) {
        if (!req.cookies[REDIRECT_COOKIE]) {
            return null;
        }
        return JSON.parse(req.cookies[REDIRECT_COOKIE]);
    }

    _setRedirectCookie(req, res, continueUrl, state) {
        const url = URL.parse(continueUrl);
        const redirectCookieValue = {continue_url: url.path, state: state};
        this._setCookie(res, REDIRECT_COOKIE, JSON.stringify(redirectCookieValue));
    }

    _setCookie(res, cookieName, cookieValue) {
        res.cookie(cookieName, cookieValue, {secure: true, httpOnly: true});
    }

    _buildNumericFailureSuffix(err) {
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
    }

    _logLifecycle(req, event, additionalFields = {}) {
        if (!req || !req.log) {
            return;
        }
        // Use originalUrl first because Express can strip matched mount paths from req.path; fallback safely to req.path then "/".
        // Lifecycle logs intentionally include only fixed event/request/outcome fields with a query-free path and no auth/session values.
        let selectedPath = '/';
        if (typeof req.originalUrl === 'string') {
            selectedPath = req.originalUrl;
        } else if (typeof req.path === 'string') {
            selectedPath = req.path;
        }
        const requestPath = URL.parse(selectedPath).pathname || '/';
        const requestMethod = req.method;
        const fields = Object.assign({event, requestMethod, requestPath}, additionalFields);
        const message = Object.entries(fields)
            .map(([key, value]) => `${key}=${value}`)
            .join(' ');
        const lifecycleLog = req.log.info || req.log.debug || req.log.error;
        if (typeof lifecycleLog === 'function') {
            lifecycleLog.call(req.log, message);
        }
    }

    getUserToken(hostname) {
        const redirect_url = FormatUrl.format(hostname, config.services.idam.probate_oauth_callback_path);
        return this.getOauth2Code(redirect_url)
            .then((result) => {
                this.checkForError(result);
                return this.getOauth2Token(result.code, redirect_url);
            })
            .then((result) => {
                this.checkForError(result);
                return result.access_token;
            })
            .catch((err) => err);
    }

    getOauth2Code(redirect_uri) {
        logger.info('calling getOauth2Code to get code');
        const usernameAndPassword = `${config.services.idam.probate_user_email}:${config.services.idam.probate_user_password}`;
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(usernameAndPassword).toString('base64')}`
        };
        const params = new URLSearchParams();
        params.append('client_id', config.services.idam.probate_oauth2_client);
        params.append('redirect_uri', redirect_uri);
        params.append('response_type', 'code');

        return AsyncFetch.fetchJson(`${config.services.idam.apiUrl}${config.services.idam.probate_oauth_authorise_path}`, {
            method: 'POST',
            timeout: 10000,
            body: params.toString(),
            headers: headers
        });
    }

    getOauth2Token(code, redirect_url) {
        logger.info('calling getOauth2Token to get auth token');
        const client_id = config.services.idam.probate_oauth2_client;
        const client_secret = config.services.idam.probate_oauth2_secret;
        const idam_api_url = config.services.idam.apiUrl;
        const redirect_uri = redirect_url;

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', redirect_uri);
        params.append('client_id', client_id);
        params.append('client_secret', client_secret);

        return AsyncFetch.fetchJson(`${idam_api_url}/oauth2/token`, {
            method: 'POST',
            timeout: 10000,
            body: params.toString(),
            headers: headers
        });
    }

    checkForError(result) {
        if (result.name === 'Error') {
            throw result;
        }
    }
}

module.exports = Security;
