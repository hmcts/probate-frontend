'use strict';

const Service = require('./Service');
const AsyncFetch = require('app/utils/AsyncFetch');

class IdamSession extends Service {
    get(securityCookie) {
        this.log('Get idam session');
        const url = `${this.endpoint}/details`;
        console.log('IdamSession get url:', url);
        console.log('IdamSession get securityCookie:', securityCookie);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${securityCookie}`
        };
        console.log('IdamSession get headers:', headers);
        const fetchOptions = AsyncFetch.fetchOptions({}, 'GET', headers);
        return AsyncFetch.fetchJson(url, fetchOptions);
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
