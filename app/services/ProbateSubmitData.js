'use strict';

const SubmitData = require('./SubmitData');
const submitData = require('app/components/submit-data');

class ProbateSubmitData extends SubmitData {
    post(data, ctx, softStop) {
        const logMessage = 'Post submit data';
        const url = `${this.endpoint}/submit`;
        const bodyData = submitData(ctx, data);
        bodyData.softStop = softStop;
        bodyData.applicantEmail = data.applicantEmail;
        return super.post(ctx, logMessage, url, bodyData);
    }
}

module.exports = ProbateSubmitData;
