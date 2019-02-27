'use strict';

const SubmitData = require('./SubmitData');

class IntestacySubmitData extends SubmitData {
    post(data, ctx, softStop) {
        const path = this.replaceEmailInPath(this.config.services.orchestrator.paths.submissions, data.applicantEmail);
        const logMessage = 'Post submit data';
        const url = this.endpoint + path;
        data.softStop = softStop;
        return super.post(ctx, logMessage, url, data);
    }
}

module.exports = IntestacySubmitData;
