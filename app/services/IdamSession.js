'use strict';

const Service = require('./Service');

class IdamSession extends Service {
    get(securityCookie) {
        this.log('Get idam session');
        const url = `${this.endpoint}/details`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${securityCookie}`
        };
        const fetchOptions = this.fetchOptions({}, 'GET', headers);
        return this.fetchJson(url, fetchOptions);
    }

    delete(accessToken) {
        this.log('Delete idam session');
        const url = `${this.endpoint}/session/${accessToken}`;
        const clientName = this.config.services.idam.probate_oauth2_client;
        const secret = this.config.services.idam.service_key;
        const headers = {
            'Authorization': `Basic ${Buffer.from(`${clientName}:${secret}`).toString('base64')}`
        };
        const fetchOptions = this.fetchOptions({}, 'DELETE', headers);
        return this.fetchJson(url, fetchOptions);
    }
}

module.exports = IdamSession;
