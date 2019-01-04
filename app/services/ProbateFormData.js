'use strict';

const FormData = require('./FormData');

class ProbateFormData extends FormData {
    get(id) {
        const logMessage = 'Get probate form data';
        const url = this.formatUrl.format(this.endpoint, `/${id}`);
        return super.get(logMessage, url);
    }

    post(id, data) {
        const logMessage = 'Post probate form data';
        const url = this.endpoint;
        return super.post(data, logMessage, url);
    }
}

module.exports = ProbateFormData;
