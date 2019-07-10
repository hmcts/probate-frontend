'use strict';

const FormData = require('./FormData');
const caseTypes = require('app/utils/CaseTypes');

class ProbateFormData extends FormData {
    get(id) {
        const logMessage = 'Get probate form data';
        const url = `${this.endpoint}/${id}`;
        return super.get(logMessage, url);
    }

    post(id, data) {
        const logMessage = 'Post probate form data';
        const url = this.endpoint;
        data.caseType = caseTypes.GOP;
        const bodyData = {
            id: id,
            formdata: data,
        };
        return super.post(bodyData, logMessage, url);
    }
}

module.exports = ProbateFormData;
