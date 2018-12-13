'use strict';

const Service = require('./Service');
const submitData = require('app/components/submit-data');

class CcdCasePaymentStatus extends Service {
    post(data, ctx) {
        this.log('Post ccd case payment status');
        const url = `${this.endpoint}/updatePaymentStatus`;
        const headers = {
            'Content-Type': 'application/json',
            'Session-Id': ctx.sessionID,
            'Authorization': ctx.authToken,
            'UserId': ctx.userId
        };
        const body = submitData(ctx, data);
        const fetchOptions = this.fetchOptions({submitdata: body}, 'POST', headers);
        return this.fetchJson(url, fetchOptions);
    }
}

module.exports = CcdCasePaymentStatus;
