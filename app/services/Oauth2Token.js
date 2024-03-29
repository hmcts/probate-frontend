'use strict';

const Service = require('./Service');
const {URLSearchParams} = require('url');
const AsyncFetch = require('app/utils/AsyncFetch');

class Oauth2Token extends Service {
    post(code, redirectUri) {
        this.log('Post oauth2 token');
        const idamConfig = this.config.services.idam;
        const clientName = idamConfig.probate_oauth2_client;
        const secret = idamConfig.probate_oauth2_secret;
        const url = this.endpoint + idamConfig.probate_oauth_token_path;
        const clientNameAndSecret = `${clientName}:${secret}`;
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(clientNameAndSecret).toString('base64')}`
        };
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
        });
        const fetchOptions = {
            method: 'POST',
            timeout: 10000,
            body: params.toString(),
            headers: headers
        };
        return AsyncFetch.fetchJson(url, fetchOptions);
    }
}

module.exports = Oauth2Token;
