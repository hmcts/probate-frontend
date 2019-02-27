'use strict';

const FormData = require('./FormData');

class ProbateFormData extends FormData {
    get(id) {
        const logMessage = 'Get probate form data';
        const url = `${this.endpoint}/${id}`;
        return super.get(logMessage, url);
    }

    post(id, data) {
        const logMessage = 'Post probate form data';
        const url = this.endpoint;
        const bodyData = {
            id: id,
            formdata: data,
            submissionReference: data.submissionReference
        };
        return super.post(bodyData, logMessage, url);
    }
}

module.exports = ProbateFormData;
