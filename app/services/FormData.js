'use strict';

const Service = require('./Service');

class FormData extends Service {
    get(id, sessionId) {
        this.log('Get form data');
        const url = `${this.endpoint}/${id}`;
        const headers = {
            'Content-Type': 'application/json',
            'Session-Id': sessionId
        };
        const fetchOptions = this.fetchOptions({}, 'GET', headers);
        return this.fetchJson(url, fetchOptions);
    }

    post(id, data, sessionId) {
        this.log('Post form data');
        const url = this.endpoint;
        const headers = {
            'Content-Type': 'application/json',
            'Session-Id': sessionId
        };
        const body = {
            id: id,
            formdata: data,
            submissionReference: data.submissionReference
        };
        const fetchOptions = this.fetchOptions(body, 'POST', headers);
        return this.fetchJson(url, fetchOptions);
    }
}

module.exports = FormData;
