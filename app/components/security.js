'use strict';

const FormatUrl = require('app/utils/FormatUrl');
const config = require('config');
const logger = require('app/components/logger');
const URL = require('url');
const {v4: UUID} = require('uuid');
const IdamSession = require('app/services/IdamSession');
const Oauth2Token = require('app/services/Oauth2Token');
const SECURITY_COOKIE = `__auth-token-${config.payloadVersion}`;
const REDIRECT_COOKIE = '__redirect';
const ACCESS_TOKEN_OAUTH2 = 'access_token';

class Security {
    constructor(loginUrl) {
        if (!loginUrl) {
            throw new Error('login URL required for Security');
        }
        this.loginUrl = loginUrl;
    }

    protect(authorisedRoles) {
        const self = this;

        return (req, res, next) => {
            let securityCookie;
            req.log = logger(req.sessionID);

            if (req.cookies) {
                securityCookie = req.cookies[SECURITY_COOKIE];
            }

            if (securityCookie) {
                const lostSession = !req.session.expires;
                const sessionExpired = req.session.expires ? req.session.expires <= Date.now() : false;
                const idamSession = new IdamSession(config.services.idam.apiUrl, req.sessionID);
                idamSession
                    .get(securityCookie)
                    .then(response => {
                        if (response.name !== 'Error') {
                            if (lostSession || sessionExpired) {
                                if (lostSession) {
                                    req.log.error('The current user session is lost.');
                                } else {
                                    req.log.error('The current user session has expired.');
                                }
                                req.log.info('Redirecting user to the time-out page.');
                                res.clearCookie(SECURITY_COOKIE);
                                if (typeof req.session.destroy === 'function') {
                                    req.session.destroy();
                                }
                                delete req.cookies;
                                delete req.sessionID;
                                delete req.session;
                                delete req.sessionStore;
                                return res.redirect('/time-out');
                            }
                            req.log.debug('Extending session for active user.');
                            req.session.expires = Date.now() + config.app.session.expires;
                            req.session.regId = response.email;
                            req.userId = response.id;
                            req.authToken = securityCookie;
                            req.session.authToken = req.authToken;
                            self._authorize(req, res, next, response.roles, authorisedRoles);
                        } else {
                            req.log.error('Error authorising user');
                            req.log.error(`Error ${JSON.stringify(response)} \n`);
                            if (response.message === 'Unauthorized') {
                                self._login(req, res);
                            } else {
                                self._denyAccess(req, res);
                            }
                        }
                    });
            } else {
                self._login(req, res);
            }
        };
    }

    _login(req, res) {
        const state = this._generateState();
        const returnUrl = FormatUrl.createHostname(req);
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
        if (userRoles.some(role => authorisedRoles.includes(role))) {
            next();
        } else {
            logger().error('[ERROR] :: Error authorising user, Role Not Authorised');
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
        const self = this;

        return (req, res) => {
            const redirectInfo = self._getRedirectCookie(req);
            req.log = logger(req.sessionID);

            if (!redirectInfo) {
                req.log.error('Redirect cookie is missing');
                self._login(req, res);
            } else if (!req.query.code) {
                req.log.warn('No code received');
                res.redirect(redirectInfo.continue_url);
            } else if (redirectInfo.state !== req.query.state) {
                req.log.error(`States do not match: ${redirectInfo.state} is not ${req.query.state}`);
                self._denyAccess(req, res);
            } else {
                self._getTokenFromCode(req)
                    .then(result => {
                        if (result.name === 'Error') {
                            req.log.error('Error while getting the access token');
                            if (result.message === 'Unauthorized') {
                                self._login(req, res);
                            } else {
                                self._denyAccess(req, res);
                            }
                        } else {
                            self._storeCookie(req, res, result[ACCESS_TOKEN_OAUTH2], SECURITY_COOKIE);
                            req.session.expires = Date.now() + config.app.session.expires;
                            res.clearCookie(REDIRECT_COOKIE);
                            res.redirect(redirectInfo.continue_url);
                        }
                    });
            }
        };
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
        if (req.protocol === 'https') {
            res.cookie(cookieName, token, {secure: true, httpOnly: true});
        } else {
            res.cookie(cookieName, token, {httpOnly: true});
        }
    }
}

module.exports = Security;
