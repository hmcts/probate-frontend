'use strict';

const Service = require('./Service');

class MultipleApplications extends Service {
    async get(email) {
        this.log('Get user applications');
        const url = this.formatUrl.format(`${this.endpoint}?email=${email}`);
        const headers = {
            'Content-Type': 'application/json',
            'Session-Id': this.sessionId
        };
        const fetchOptions = this.fetchOptions({}, 'GET', headers);
        const result = await this.fetchJson(url, fetchOptions);
        return result;
    }
}

module.exports = MultipleApplications;
