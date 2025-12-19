'use strict';

const Service = require('./Service.cjs');
const otp = require('otp');
const AsyncFetch = require('app/utils/AsyncFetch.cjs');

class Authorise extends Service {
    post() {
        this.log('Post authorise');
        const url = `${this.endpoint}/lease`;
        const headers = {
            'Content-Type': 'application/json'
        };
        const serviceName = this.config.services.idam.service_name;
        const secret = this.config.services.idam.service_key;
        const params = {
            microservice: serviceName,
            oneTimePassword: otp({secret: secret}).totp()
        };
        const fetchOptions = AsyncFetch.fetchOptions(params, 'POST', headers);
        return this.fetchText(url, fetchOptions);
    }
}

module.exports = Authorise;
