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
const SECURITY_COOKIE = `__auth-token-${config.payloadVersion}`;
const REDIRECT_COOKIE = '__redirect';
const ACCESS_TOKEN_OAUTH2 = 'access_token';
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
            redisEnabled: config.redis && config.redis.enabled,
            sessionTtl: config.app && config.app.session && config.app.session.ttl
        });
    }

    protect(authorisedRoles) {
        return (req, res, next) => {
            let securityCookie;
            req.log = loggerRaw(req.sessionID);

            if (req.cookies) {
                securityCookie = req.cookies[SECURITY_COOKIE];
            }

            if (securityCookie) {
                if ([SessionStatusEnum.getExpired(), SessionStatusEnum.getLost()].includes(this.getSessionStatus(req))) {
                    req.log.error(`The current user session is ${this.getSessionStatus(req)}, redirecting user to the time-out page.`);
                    this.handleLostOrExpiredSession(req, res);
                    return res.redirect('/time-out');
                }

                const authorizeAfterActiveSessionValidation = idamResponse => {
                    const validationResult = this._validateActiveSession(req, res);
                    if (validationResult && typeof validationResult.then === 'function') {
                        validationResult.then(sessionIsActive => {
                            if (sessionIsActive) {
                                this._authorize(req, res, next, idamResponse.roles, authorisedRoles);
                            }
                        });
                    } else if (validationResult) {
                        this._authorize(req, res, next, idamResponse.roles, authorisedRoles);
                    }
                };

                const isIdamDetailsCached = this.idamDetailsCache && req.session.regId && this.idamDetailsCache.get(req.session.regId);
                if (isIdamDetailsCached) {
                    console.log('Using cache...');
                    const cachedResponse = this.idamDetailsCache.get(req.session.regId);
                    this.handleSuccessfulIdamDetailsResponse(req, cachedResponse);
                    authorizeAfterActiveSessionValidation(cachedResponse);
                } else {
                    const idamSession = new IdamSession(config.services.idam.apiUrl, req.sessionID);
                    idamSession
                        .get(securityCookie)
                        .then(response => {
                            if (response.name !== 'Error') {
                                req.log.debug('Extending session for active user.');
                                this.handleSuccessfulIdamDetailsResponse(req, response);
                                authorizeAfterActiveSessionValidation(response);
                                if (this.idamDetailsCache) {
                                    console.log('Setting cache...');
                                    this.idamDetailsCache.set(req.session.regId, response);
                                }
                            } else {
                                req.log.error('Error authorising user');
                                req.log.error(`Error ${JSON.stringify(response)} \n`);
                                if (response.message === 'Unauthorized') {
                                    this._login(req, res);
                                } else {
                                    this._denyAccess(req, res);
                                }
                            }
                        });
                }
            } else {
                this._login(req, res);
            }
        };
    }

    handleSuccessfulIdamDetailsResponse(req, res, authToken = req.cookies[SECURITY_COOKIE]) {
        req.session.expires = Date.now() + config.app.session.expires;
        req.session.regId = res.email;
        req.session.idamUserId = res.id;
        req.userId = res.id;
        req.authToken = authToken;
        req.session.authToken = req.authToken;
    }

    getSessionStatus(req) {
        if (!req.session.expires) {
            return SessionStatusEnum.getLost();
        }
        if (req.session.expires <= Date.now()) {
            return SessionStatusEnum.getExpired();
        }
        return SessionStatusEnum.getActive();
    }

    handleLostOrExpiredSession(req, res) {
        res.clearCookie(SECURITY_COOKIE);
        if (typeof req.session.destroy === 'function') {
            req.session.destroy();
        }
        delete req.cookies;
        delete req.sessionID;
        delete req.session;
        delete req.sessionStore;
    }

    _login(req, res) {
        const state = this._generateState();
        let returnUrl = FormatUrl.createHostname(req);
        if (req.baseUrl.indexOf('get-case') > 0) {
            returnUrl += req.originalUrl;
        }
        this._storeRedirectCookie(req, res, returnUrl, state);
        const idamConfig = config.services.idam;

        const callbackUrl = FormatUrl.format(returnUrl, idamConfig.probate_oauth_callback_path);
        const redirectUrl = URL.parse(this.loginUrl, true);
        redirectUrl.query.ui_locales = req.session.language;
        redirectUrl.query.response_type = 'code';
        redirectUrl.query.state = state;
        redirectUrl.query.client_id = idamConfig.probate_oauth2_client;
        redirectUrl.query.redirect_uri = callbackUrl;

        res.redirect(redirectUrl.format());
    }

    _authorize(req, res, next, userRoles, authorisedRoles) {
        if (userRoles?.some(role => authorisedRoles.includes(role))) {
            next();
        } else {
            loggerRaw().error('[ERROR] :: Error authorising user, Role Not Authorised');
            this._denyAccess(req, res);
        }
    }

    _denyAccess(req, res) {
        const commonContent = require(`app/resources/${req.session.language}/translation/common`);
        const content = require(`app/resources/${req.session.language}/translation/errors/403`);

        res.clearCookie(SECURITY_COOKIE);
        res.status(403);
        res.render('errors/error', {common: commonContent, content: content, error: '403', userLoggedIn: false});
    }

    _generateState() {
        return UUID();
    }

    oAuth2CallbackEndpoint() {
        return (req, res, next) => {
            const redirectInfo = this._getRedirectCookie(req);
            req.log = loggerRaw(req.sessionID);

            if (!redirectInfo) {
                req.log.error('Redirect cookie is missing');
                this._login(req, res);
            } else if (!req.query.code) {
                req.log.warn('No code received');
                this._login(req, res);
            } else if (redirectInfo.state !== req.query.state) {
                req.log.error(`States do not match: ${redirectInfo.state} is not ${req.query.state}`);
                this._denyAccess(req, res);
            } else {
                this._getTokenFromCode(req)
                    .then(result => {
                        if (result.name === 'Error') {
                            req.log.error('Error while getting the access token');
                            if (result.message === 'Unauthorized') {
                                this._login(req, res);
                            } else {
                                this._denyAccess(req, res);
                            }
                        } else {
                            const idamSession = new IdamSession(config.services.idam.apiUrl, req.sessionID);
                            return idamSession.get(result[ACCESS_TOKEN_OAUTH2])
                                .then(response => {
                                    if (response.name === 'Error') {
                                        req.log.error('Error authorising user in callback');
                                        if (response.message === 'Unauthorized') {
                                            this._login(req, res);
                                        } else {
                                            this._denyAccess(req, res);
                                        }
                                        return null;
                                    }

                                    if (!response.id) {
                                        throw new Error('IDAM details response did not include a user ID.');
                                    }

                                    this.handleSuccessfulIdamDetailsResponse(req, response, result[ACCESS_TOKEN_OAUTH2]);
                                    return this._activateLatestSession(req)
                                        .then(() => {
                                            this._storeCookie(req, res, result[ACCESS_TOKEN_OAUTH2], SECURITY_COOKIE);
                                            res.clearCookie(REDIRECT_COOKIE);
                                            res.redirect(redirectInfo.continue_url);
                                            return null;
                                        });
                                });
                        }
                        return null;
                    })
                    .catch(err => {
                        next(err);
                    });
            }
        };
    }

    _activateLatestSession(req) {
        return this.sessionConcurrency
            .activateLatest(req.sessionStore, req.session.idamUserId, req.sessionID)
            .then(result => {
                req.log.debug('Active session mapping updated for authenticated user.');
                if (result && result.destroyError) {
                    req.log.error(`Unable to destroy previous active session: ${result.destroyError}`);
                }
                return result;
            });
    }

    _validateActiveSession(req, res) {
        try {
            if (!this.sessionConcurrency.canManageSession(req.sessionStore)) {
                return true;
            }

            if (!req.session.idamUserId || !req.sessionID) {
                req.log.error('Active-session ownership data is missing, redirecting user to the time-out page.');
                this.handleLostOrExpiredSession(req, res);
                res.redirect('/time-out');
                return false;
            }

            return this.sessionConcurrency
                .assertAndTouch(req.sessionStore, req.session.idamUserId, req.sessionID)
                .then(sessionIsActive => {
                    if (!sessionIsActive) {
                        req.log.error('Active-session mismatch detected, redirecting user to the time-out page.');
                        this.handleLostOrExpiredSession(req, res);
                        res.redirect('/time-out');
                    }

                    return sessionIsActive;
                })
                .catch(err => {
                    req.log.error(`Unable to validate active session mapping: ${err}`);
                    this.handleLostOrExpiredSession(req, res);
                    res.redirect('/time-out');
                    return false;
                });
        } catch (err) {
            req.log.error(`Unable to validate active session mapping: ${err}`);
            this.handleLostOrExpiredSession(req, res);
            res.redirect('/time-out');
            return false;
        }
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

    _storeRedirectCookie(req, res, continue_url, state) {
        const url = URL.parse(continue_url);
        const cookieValue = {continue_url: url.path, state: state};
        this._storeCookie(req, res, JSON.stringify(cookieValue), REDIRECT_COOKIE);
    }

    _storeCookie(req, res, token, cookieName) {
        res.cookie(cookieName, token, {secure: true, httpOnly: true});
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
