'use strict';

const paymentData = require('app/components/payment-data');
const {assert} = require('chai');

describe('payment-data.js', () => {
    describe('createPaymentFees()', () => {
        it('should return the correct data', () => {
            const params = {
                amount: 4.50,
                ccdCaseId: 'CASEREF123',
                code: 'CODE123',
                memoLine: 'Additional overseas copies',
                reference: 123,
                version: 3,
                volume: 3
            };
            const paymentFees = paymentData.createPaymentFees(params);
            assert.deepEqual(paymentFees, {
                calculated_amount: params.amount,
                ccd_case_number: params.ccdCaseId,
                code: params.code,
                memo_line: params.memoLine,
                reference: params.reference,
                version: params.version,
                volume: params.volume
            });
        });
    });
});
