'use strict';

const Service = require('./Service');
const otp = require('otp');

class Authorise extends Service {
    post() {
        this.log('Post authorise');
        const url = this.endpoint;
        const headers = {
            'Content-Type': 'application/json'
        };
        const serviceName = this.config.services.idam.service_name;
        const secret = this.config.services.idam.service_key;
        const params = {
            microservice: serviceName,
            oneTimePassword: otp({secret: secret}).totp()
        };
        const fetchOptions = this.fetchOptions(params, 'POST', headers);
        return this.fetchText(url, fetchOptions);
    }
}

module.exports = Authorise;
