'use strict';

const Service = require('./Service');

class FeesRegister extends Service {
    get(url, headers) {
        const fetchOptions = this.fetchOptions({}, 'GET', {
            'Content-Type': 'application/json',
            'Authorization': headers.authToken
        });
        return this.fetchJson(url, fetchOptions);
    }

}

module.exports = FeesRegister;
