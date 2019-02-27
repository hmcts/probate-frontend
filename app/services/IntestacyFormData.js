'use strict';

const FormData = require('./FormData');

class IntestacyFormData extends FormData {
    get(id) {
        const path = this.replaceEmailInPath(this.config.services.orchestrator.paths.forms, id);
        const logMessage = 'Get intestacy form data';
        const url = this.endpoint + path;
        return super.get(logMessage, url);
    }

    post(id, data) {
        const path = this.replaceEmailInPath(this.config.services.orchestrator.paths.forms, id);
        const logMessage = 'Post intestacy form data';
        const url = this.endpoint + path;
        return super.post(data, logMessage, url);
    }
}

module.exports = IntestacyFormData;
