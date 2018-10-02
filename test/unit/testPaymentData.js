const paymentData = require('app/components/payment-data');
const assert = require('chai').assert;

describe('PaymentData', () => {
    describe('createPaymentData', () => {
        it('Returns a payment data object containing the amount converted to pence', () => {
            const data = {
                amount: '10',
                copies: {
                    uk: {
                        number: 0
                    },
                    overseas: {
                        number: 0
                    }
                }
            };
            const result = paymentData.createPaymentData(data);
            assert.equal(result.amount, '10');
        });

        it('Returns a payment data object containing a description', () => {
            const data = {
                copies: {
                    uk: {
                        number: 0
                    },
                    overseas: {
                        number: 0
                    }
                }
            };
            const result = paymentData.createPaymentData(data);
            assert.exists(result.description);
        });

    });

    describe('createPaymentFees', () => {
        it('should return the correct data', () => {
            const params = {
                amount: 1.50,
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
