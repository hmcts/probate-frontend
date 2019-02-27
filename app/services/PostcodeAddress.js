'use strict';

const Service = require('./Service');

class PostcodeAddress extends Service {
    get(postcode) {
        this.log('Get postcode address');
        const token = this.config.services.postcode.token;
        const proxy = this.config.services.postcode.proxy;
        const url = `${this.endpoint}?postcode=${encodeURIComponent(postcode)}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        };
        const fetchOptions = this.fetchOptions({}, 'GET', headers, proxy);
        return this.fetchJson(url, fetchOptions);
    }
}

module.exports = PostcodeAddress;
