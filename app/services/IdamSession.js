'use strict';

const Service = require('./Service');
const AsyncFetch = require('app/utils/AsyncFetch');

class IdamSession extends Service {
    get(securityCookie) {
        this.log('Get idam session');
        const url = `${this.endpoint}/details`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${securityCookie}`
        };
        const fetchOptions = AsyncFetch.fetchOptions({}, 'GET', headers);
        return AsyncFetch.fetchJson(url, fetchOptions);
    }

    async logoutIdam(req, res, postLogoutRedirectUri) {
        this.log('Logout and clear session');
        const SECURITY_COOKIE = `__auth-token-${this.config.payloadVersion}`;
        const logoutIdamUrl = `${this.config.services.idam.endSessionUrl}/?post_logout_redirect_uri=${encodeURI(postLogoutRedirectUri)}`;
        this.log('Logout url: ' + logoutIdamUrl);

        return new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    this.log(`Error destroying session: ${err}`);
                    return reject(err);
                }
                res.clearCookie(SECURITY_COOKIE);
                delete req.cookies;
                delete req.sessionID;
                delete req.session;
                delete req.sessionStore;
                return res.redirect(303, logoutIdamUrl);
            });
        });
    }

    delete(accessToken) {
        this.log('Delete idam session');
        const url = `${this.endpoint}/session/${accessToken}`;
        const clientName = this.config.services.idam.probate_oauth2_client;
        const secret = this.config.services.idam.service_key;
        const clientNameAndSecret = `${clientName}:${secret}`;
        const headers = {
            'Authorization': `Basic ${Buffer.from(clientNameAndSecret).toString('base64')}`
        };
        const fetchOptions = AsyncFetch.fetchOptions({}, 'DELETE', headers);
        return AsyncFetch.fetchJson(url, fetchOptions);
    }
}

module.exports = IdamSession;
