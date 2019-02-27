'use strict';

const Service = require('./Service');

class FormData extends Service {
    get(logMessage, url) {
        this.log(logMessage);
        const headers = {
            'Content-Type': 'application/json',
            'Session-Id': this.sessionId
        };
        const fetchOptions = this.fetchOptions({}, 'GET', headers);
        return this.fetchJson(url, fetchOptions);
    }

    post(data, logMessage, url) {
        this.log(logMessage);
        const headers = {
            'Content-Type': 'application/json',
            'Session-Id': this.sessionId
        };
        const fetchOptions = this.fetchOptions(data, 'POST', headers);
        return this.fetchJson(url, fetchOptions);
    }
}

module.exports = FormData;
