'use strict';

const Service = require('./Service');
const {URLSearchParams} = require('url');

class Oauth2Token extends Service {
    post(code, redirectUri) {
        this.log('Post oauth2 token');
        const clientName = this.config.services.idam.probate_oauth2_client;
        const secret = this.config.services.idam.probate_oauth2_secret;
        const url = `${this.endpoint}/oauth2/token`;
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${new Buffer(`${clientName}:${secret}`).toString('base64')}`
        };
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
        });
        const fetchOptions = this.fetchOptions(params, 'POST', headers);
        return this.fetchJson(url, fetchOptions);
    }
}

module.exports = Oauth2Token;
