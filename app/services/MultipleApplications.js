'use strict';

const Service = require('./Service');

class MultipleApplications extends Service {
    get(email) {
        const url = this.formatUrl.format(this.endpoint, `/email=${email}`);
        const headers = {
            'Content-Type': 'application/json',
            'Session-Id': this.sessionId
        };
        const fetchOptions = this.fetchOptions({}, 'GET', headers);
        return this.fetchJson(url, fetchOptions);
    }
}

module.exports = MultipleApplications;
