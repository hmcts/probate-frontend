'use strict';

const SubmitData = require('./SubmitData');
const submitData = require('app/components/submit-data');

class ProbateSubmitData extends SubmitData {
    post(data, ctx, softStop) {
        const logMessage = 'Post probate submit data';
        const url = `${this.endpoint}/submit`;
        let bodyData = submitData(ctx, data);
        bodyData = Object.assign(bodyData, {
            softStop: softStop,
            applicantEmail: data.applicantEmail
        });
        return super.post(ctx, logMessage, url, {submitdata: bodyData});
    }
}

module.exports = ProbateSubmitData;
