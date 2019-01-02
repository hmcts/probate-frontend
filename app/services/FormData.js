'use strict';

const Service = require('./Service');

class FormData extends Service {
    constructor(endpoint, journeyType, sessionId) {
        super(endpoint, journeyType, sessionId);
        this.path = this.getPath(this.journeyType, this.config.services.orchestrator.paths.forms, '');
        this.headers = {
            'Content-Type': 'application/json',
            'Session-Id': this.sessionId
        };
    }

    get(id) {
        this.log('Get form data');
        const url = `${this.endpoint}${this.path}/${id}`;
        const fetchOptions = this.fetchOptions({}, 'GET', this.headers);
        return this.fetchJson(url, fetchOptions);
    }

    post(id, data) {
        this.log('Post form data');
        const url = this.endpoint + this.path;
        const body = {
            id: id,
            formdata: data,
            submissionReference: data.submissionReference
        };
        const fetchOptions = this.fetchOptions(body, 'POST', this.headers);
        return this.fetchJson(url, fetchOptions);
    }
}

module.exports = FormData;
