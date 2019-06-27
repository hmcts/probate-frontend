'use strict';

const FormData = require('./FormData');
const caseTypes = require('app/utils/CaseTypes');

class IntestacyFormData extends FormData {
    get(id) {
        const logMessage = 'Get intestacy form data';
        const url = `${this.endpoint}/${id}`;
        return super.get(logMessage, url);
    }

    post(id, data) {
        const logMessage = 'Post intestacy form data';
        const url = this.endpoint;
        data.caseType = caseTypes.INTESTACY;
        const bodyData = {
            id: id,
            formdata: data,
        };
        return super.post(bodyData, logMessage, url);
    }
}

module.exports = IntestacyFormData;
