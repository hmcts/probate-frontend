'use strict';

const Service = require('./Service');

class ValidateData extends Service {
    post(data, sessionId) {
        this.log('Post validate data');
        const headers = {
            'Content-Type': 'application/json',
            'Session-Id': sessionId
        };
        const fetchOptions = this.fetchOptions({formdata: data}, 'POST', headers);
        return this.fetchJson(this.endpoint, fetchOptions);
    }
}

module.exports = ValidateData;
