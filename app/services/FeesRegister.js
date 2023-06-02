'use strict';

const Service = require('./Service');
const AsyncFetch = require('app/utils/AsyncFetch');

class FeesRegister extends Service {
    get(url, headers) {
        const fetchOptions = AsyncFetch.fetchOptions({}, 'GET', {
            'Content-Type': 'application/json',
            'Authorization': headers.authToken
        });
        return AsyncFetch.fetchJson(url, fetchOptions);
    }
}

module.exports = FeesRegister;
