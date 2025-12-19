'use strict';

const Service = require('./Service.cjs');
const paymentData = require('app/components/payment-data.cjs');
const config = require('config');
const {forEach} = require('lodash');
const AsyncFetch = require('app/utils/AsyncFetch.cjs');

class Payment extends Service {
    get(data) {
        this.log('Get payment');
        const url = `${this.endpoint}/${data.paymentId}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': data.authToken,
            'ServiceAuthorization': data.serviceAuthToken
        };
        const fetchOptions = AsyncFetch.fetchOptions(data, 'GET', headers);
        return AsyncFetch.fetchJson(url, fetchOptions);
    }

    getCasePayments(data) {
        this.log('Getting all payments from case');
        const url = `${this.endpoint}?service_name=Probate&ccd_case_number=${data.caseId}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': data.authToken,
            'ServiceAuthorization': data.serviceAuthToken
        };
        const fetchOptions = AsyncFetch.fetchOptions(data, 'GET', headers);
        return AsyncFetch.fetchJson(url, fetchOptions);
    }

    post(data, hostname, language) {
        this.log('Post payment');
        const url = this.endpoint;
        const paymentUpdatesCallback = config.services.orchestrator.url + config.services.orchestrator.paths.payment_updates;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': data.authToken,
            'ServiceAuthorization': data.serviceAuthToken,
            'return-url': this.formatUrl.format(hostname, config.services.payment.paths.returnUrlPath),
            'service-callback-url': paymentUpdatesCallback
        };
        const body = paymentData.createPaymentData(data, language);
        const fetchOptions = AsyncFetch.fetchOptions(body, 'POST', headers);
        return AsyncFetch.fetchJson(url, fetchOptions);
    }

    identifySuccessfulOrInitiatedPayment(casePayments) {
        let response = false;
        forEach(casePayments.payments, (payment) => {
            if (payment.status.toLowerCase() === 'success') {
                this.log(`Found a successful payment: ${payment.payment_reference}`);
                response = payment;
                return false;
            } else if (payment.status.toLowerCase() === 'initiated') {
                this.log(`Found an initiated payment: ${payment.payment_reference}`);
                response = payment;
            }
        });
        if (response === false) {
            this.log('No payments of Success or Initiated found.');
        }
        return response;
    }
}

module.exports = Payment;
