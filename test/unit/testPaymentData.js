'use strict';

const paymentData = require('app/components/payment-data');
const assert = require('chai').assert;
const config = require('app/config');

describe('PaymentData', function () {

    describe('createPaymentData', function () {

        it('Returns a payment data object containing the amount converted to pence', function () {

            const data = {
                amount: '10',
            };

            const result = paymentData.createPaymentData(data, 'https://localhost');

            assert.equal(result.amount, '1000');

        });

        it('Returns a payment data object, with fee, no extra copies', function () {

            const data = {
                applicationFee: config.payment.applicationFee
            };

            const expectedReference = 'CODE4$$$123456$$$CODE5$$$CODE1';

            const result = paymentData.createPaymentData(data, 'https://localhost', () => {
return '123456';
});

            assert.equal(result.reference, expectedReference);

        });

        it('Returns a payment data object, with fee and uk copies, no overseas copies', function () {

            const data = {
                applicationFee: config.payment.applicationFee,
                copies: {
                    uk: {number: 1},
                },
            };

            const expectedReference = 'CODE4$$$123456$$$CODE5$$$CODE1$CODE2/1';

            const result = paymentData.createPaymentData(data, 'https://localhost', () => {
return '123456';
});

            assert.equal(result.reference, expectedReference);

        });

       it('Returns a payment data object, with fee, no uk copies, with overseas copies', function () {

            const data = {
                applicationFee: config.payment.applicationFee,
                copies: {
                    overseas: {number: 2}
                },
            };

            const expectedReference = 'CODE4$$$123456$$$CODE5$$$CODE1$CODE3/2';

            const result = paymentData.createPaymentData(data, 'https://localhost', () => {
return '123456';
});

            assert.equal(result.reference, expectedReference);

        });

         it('Returns a payment data object, with fee, with uk copies, with overseas copies', function () {

            const data = {
                applicationFee: config.payment.applicationFee,
                copies: {
                    uk: {number: 3},
                    overseas: {number: 4}
                },
            };

            const expectedReference = 'CODE4$$$123456$$$CODE5$$$CODE1$CODE2/3$CODE3/4';

            const result = paymentData.createPaymentData(data, 'https://localhost', () => {
return '123456';
});

            assert.equal(result.reference, expectedReference);

        });

        it('Returns a payment data object, no fee, with extra uk copies, no overseas copies', function () {

            const expectedReference = 'CODE4$$$123456$$$CODE5$$$CODE2/5';

            const data = {
                applicationFee: 0,
                 copies: {
                    uk: {number: 5},
                },
            };

            const result = paymentData.createPaymentData(data, 'https://localhost', () => {
return '123456';
});

            assert.deepEqual(result.reference, expectedReference);

        });

         it('Returns a payment data object, no fee, no uk copies, with overseas copies', function () {

            const data = {
                applicationFee: 0,
                 copies: {
                    overseas: {number: 6},
                },
            };

            const expectedReference = 'CODE4$$$123456$$$CODE5$$$CODE3/6';

            const result = paymentData.createPaymentData(data, 'https://localhost', () => {
return '123456';
});

            assert.deepEqual(result.reference, expectedReference);

        });

         it('Returns a payment data object, no fee, with uk copies, with overseas copies', function () {

            const data = {
                applicationFee: 0,
                 copies: {
                    uk: {number: 7},
                    overseas: {number: 8},
                },
            };

            const expectedReference = 'CODE4$$$123456$$$CODE5$$$CODE2/7$CODE3/8';

            const result = paymentData.createPaymentData(data, 'https://localhost', () => {
return '123456';
});

            assert.deepEqual(result.reference, expectedReference);

        });

        it('Returns a payment data object containing a description', function () {

            const data = {};

            const result = paymentData.createPaymentData(data, 'https://localhost');

            assert.exists(result.description);
        });

        it('Returns a payment data object containing the return URL', function () {

            const data = {};

            const result = paymentData.createPaymentData(data, 'https://localhost');

            assert.equal(result.return_url, `https://localhost${config.services.payment.returnUrlPath}`);
        });

        it('Limits case reference to 32 characters', function () {
            const result = paymentData.createCaseReference('abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz');
            assert.isTrue(result.length === 32);

        });
    });
});
