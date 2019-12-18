'use strict';

const isEmpty = require('lodash').isEmpty;

class Payment {
    constructor(payment) {
        this.payment = payment || {};
    }

    paymentIsSuccessful() {
        return this.payment.status === 'Success';
    }

    paymentIsNotRequired() {
        return this.payment.status === 'not_required';
    }

    hasPassedPayment() {
        return !isEmpty(this.payment);
    }
}

module.exports = Payment;
