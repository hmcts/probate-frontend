'use strict';

const SubmitData = require('./SubmitData');
const submitData = require('app/components/submit-data');

class IntestacySubmitData extends SubmitData {
    post(data, ctx, softStop) {
        const path = this.replaceEmailInPath(this.config.services.orchestrator.paths.submissions, data.applicantEmail);
        const logMessage = 'Post submit data';
        const url = this.endpoint + path;
        const bodyData = submitData(ctx, data);
        bodyData.softStop = softStop;
        bodyData.applicantEmail = data.applicantEmail;
        return super.post(ctx, logMessage, url, bodyData);
    }
}

module.exports = IntestacySubmitData;
