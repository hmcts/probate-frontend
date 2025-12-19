'use strict';

const PaymentWrapper = require('app/wrappers/Payment.cjs');
const expect = require('chai').expect;

describe('Payment.js', () => {
    describe('paymentIsSuccessful()', () => {
        it('should return true if the payment was successful', (done) => {
            const data = {status: 'Success'};
            const paymentWrapper = new PaymentWrapper(data);
            expect(paymentWrapper.paymentIsSuccessful()).to.equal(true);
            done();
        });

        it('should return false if the payment was not successful', (done) => {
            const data = {status: 'Failure'};
            const paymentWrapper = new PaymentWrapper(data);
            expect(paymentWrapper.paymentIsSuccessful()).to.equal(false);
            done();
        });
    });

    describe('paymentIsNotRequired()', () => {
        it('should return true if the payment is not required', (done) => {
            const data = {status: 'not_required'};
            const paymentWrapper = new PaymentWrapper(data);
            expect(paymentWrapper.paymentIsNotRequired()).to.equal(true);
            done();
        });

        it('should return false if the payment is required', (done) => {
            const data = {status: 'required'};
            const paymentWrapper = new PaymentWrapper(data);
            expect(paymentWrapper.paymentIsNotRequired()).to.equal(false);
            done();
        });
    });

    describe('hasPassedPayment()', () => {
        it('should return true if the user has passed the payment stage', (done) => {
            const data = {total: 215};
            const paymentWrapper = new PaymentWrapper(data);
            expect(paymentWrapper.hasPassedPayment()).to.equal(true);
            done();
        });

        it('should return false if the user has not yet passed the payment stage', (done) => {
            const data = {};
            const paymentWrapper = new PaymentWrapper(data);
            expect(paymentWrapper.hasPassedPayment()).to.equal(false);
            done();
        });
    });
});
