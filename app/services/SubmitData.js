'use strict';

const Service = require('./Service');
const submitData = require('app/components/submit-data');

class SubmitData extends Service {
    post(data, ctx, softStop) {
        this.log('Post submit data');
        const url = `${this.endpoint}/submit`;
        const headers = {
            'Content-Type': 'application/json',
            'Session-Id': ctx.sessionID,
            'Authorization': ctx.authToken,
            'UserId': ctx.userId
        };
        const body = submitData(ctx, data);
        body.softStop = softStop;
        body.applicantEmail = data.applicantEmail;
        const fetchOptions = this.fetchOptions({submitdata: body}, 'POST', headers);
        return this.fetchJson(url, fetchOptions);
    }
}

module.exports = SubmitData;
