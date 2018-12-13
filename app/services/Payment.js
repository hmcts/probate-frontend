'use strict';

const Service = require('./Service');
const paymentData = require('app/components/payment-data');

class Payment extends Service {
    get(data) {
        this.log('Get payment');
        const url = `${this.endpoint}/${data.paymentId}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': data.authToken,
            'ServiceAuthorization': data.serviceAuthToken
        };
        const fetchOptions = this.fetchOptions(data, 'GET', headers);
        return this.fetchJson(url, fetchOptions);
    }

    post(data, hostname) {
        this.log('Post payment');
        const url = this.endpoint;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': data.authToken,
            'ServiceAuthorization': data.serviceAuthToken,
            'return-url': this.formatUrl.format(hostname, '/payment-status')
        };
        const body = paymentData.createPaymentData(data);
        const fetchOptions = this.fetchOptions(body, 'POST', headers);
        return [this.fetchJson(url, fetchOptions), body.reference];
    }
}

module.exports = Payment;
