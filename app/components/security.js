'use strict';

const FormatUrl = require('app/utils/FormatUrl');
const config = require('../config');
const services = require('app/components/services');
const logger = require('app/components/logger')('Init');
const URL = require('url');
const UUID = require('uuid/v4');
const commonContent = require('app/resources/en/translation/common');

const SECURITY_COOKIE = '__auth-token-' + config.payloadVersion;
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

        return function (req, res, next) {
            logger.info(`${req.sessionID}`);
            let securityCookie;
            if (req.cookies) {
                securityCookie = req.cookies[SECURITY_COOKIE];
            }

            // Retrieve user details
            if (securityCookie) {
                services.getUserDetails(securityCookie)
                    .then(response => {
                        if (response.name !== 'Error') {
                            req.session.regId = response.email;
                            req.userId = response.id;
                            req.authToken = securityCookie;
                            self._authorize(res, next, response.roles, authorisedRoles);
                        } else {
                            logger.error('Error authorising user');
                            logger.error(`Error ${JSON.stringify(response)} \n`);
                            if (response.message === 'Unauthorized') {
                                self._login(req, res);
                            } else {
                                self._denyAccess(res);
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

        const callbackUrl = FormatUrl.format(returnUrl, config.services.idam.probate_oauth_callback_path);
        const redirectUrl = URL.parse(this.loginUrl, true);
        redirectUrl.query.response_type = 'code';
        redirectUrl.query.state = state;
        redirectUrl.query.client_id = 'probate';
        redirectUrl.query.redirect_uri = callbackUrl;

        res.redirect(redirectUrl.format());
    }

    _authorize(res, next, userRoles, authorisedRoles) {
        if (userRoles.some(role => authorisedRoles.includes(role))) {
            next();
        } else {
            logger.error('[ERROR] :: Error authorising user, Role Not Authorised');
            this._denyAccess(res);
        }
    }

    _denyAccess(res) {
        res.clearCookie(SECURITY_COOKIE);
        res.status(403);
        res.render('errors/403', {common: commonContent});
    }

    _generateState() {
        return UUID();
    }

    oAuth2CallbackEndpoint() {
        const self = this;
        return function (req, res) {

            const redirectInfo = self._getRedirectCookie(req);

            if (!redirectInfo) {
                logger.error('Redirect cookie is missing');
                self._login(req, res);
            } else if (!req.query.code) {
                logger.warn('No code received');
                res.redirect(redirectInfo.continue_url);
            } else if (redirectInfo.state !== req.query.state) {
                logger.error('States do not match: ' + redirectInfo.state + ' is not ' + req.query.state);
                self._denyAccess(res);
            } else {
                self._getTokenFromCode(req)
                    .then(result => {
                        if (result.name === 'Error') {
                            logger.error('Error while getting the access token');
                            if (result.message === 'Unauthorized') {
                                self._login(req, res);
                            } else {
                                self._denyAccess(res);
                            }
                        } else {
                            self._storeCookie(req, res, result[ACCESS_TOKEN_OAUTH2], SECURITY_COOKIE);
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
        return services.getOauth2Token(req.query.code, redirectUri);
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
