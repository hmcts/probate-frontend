'use strict';

const Service = require('./Service');

class UserDetails extends Service {
    get(securityCookie) {
        this.log('Get user details');
        const url = `${this.endpoint}/details`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${securityCookie}`
        };
        const fetchOptions = this.fetchOptions({}, 'GET', headers);
        return this.fetchJson(url, fetchOptions);
    }
}

module.exports = UserDetails;
