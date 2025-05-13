'use strict';

const Service = require('./Service');
const AsyncFetch = require('app/utils/AsyncFetch');

class PinNumber extends Service {
    get(phoneNumber, bilingual = false, authToken, serviceAuthorisation) {
        this.log('POST pin number');
        phoneNumber = encodeURIComponent(phoneNumber);
        const url = this.formatUrl.format(this.endpoint, `/invite/pin${bilingual ? '/bilingual': ''}`);
        const headers = {
            'Content-Type': 'application/json',
            'Session-Id': this.sessionId,
            'Authorization': authToken,
            'ServiceAuthorization': serviceAuthorisation
        };
        const body = {
            phoneNumber: phoneNumber,
        };
        const fetchOptions = AsyncFetch.fetchOptions(body, 'POST', headers);
        return AsyncFetch.fetchJson(url, fetchOptions);
    }
}

module.exports = PinNumber;
