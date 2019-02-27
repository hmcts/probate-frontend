'use strict';

const Service = require('./Service');

class PinNumber extends Service {
    get(phoneNumber) {
        this.log('Get pin number');
        phoneNumber = encodeURIComponent(phoneNumber);
        const url = this.formatUrl.format(this.endpoint, `/pin?phoneNumber=${phoneNumber}`);
        const headers = {
            'Content-Type': 'application/json',
            'Session-Id': this.sessionId
        };
        const fetchOptions = this.fetchOptions({}, 'GET', headers);
        return this.fetchJson(url, fetchOptions);
    }
}

module.exports = PinNumber;
