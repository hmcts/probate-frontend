'use strict';

const SubmitData = require('./SubmitData');

class IntestacySubmitData extends SubmitData {
    post(data, ctx) {
        const path = this.replaceEmailInPath(this.config.services.orchestrator.paths.submissions, data.applicant.email);
        const logMessage = 'Post submit data';
        const url = this.endpoint + path;
        return super.post(ctx, logMessage, url, data);
    }
}

module.exports = IntestacySubmitData;
