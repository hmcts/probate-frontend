'use strict';

const Service = require('./Service');

class SubmitData extends Service {
    post(ctx, logMessage, url, bodyData) {
        this.log(logMessage);
        const headers = {
            'Content-Type': 'application/json',
            'Session-Id': ctx.sessionID,
            'Authorization': ctx.authToken,
            'UserId': ctx.userId
        };
        const fetchOptions = this.fetchOptions(bodyData, 'POST', headers);
        return this.fetchJson(url, fetchOptions);
    }
}

module.exports = SubmitData;
