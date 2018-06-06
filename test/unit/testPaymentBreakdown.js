'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const co = require('co');

describe('PaymentBreakdown', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

    describe('handleGet', () => {
        it('cleans up context', () => {
            const ctx = {
                paymentError: 'failure'
            };
            const PaymentBreakdown = steps.PaymentBreakdown;
            const [, errors] = PaymentBreakdown.handleGet(ctx);

            assert.deepEqual(errors[0].param, 'payment');
        });
    });

    describe('handlePost', () => {
        it('sets paymentPending to false if ctx.total = 0', (done) => {
            const PaymentBreakdown = steps.PaymentBreakdown;
            let ctx = {total: 0};
            let errors = [];
            const formdata = {};

            co(function* () {
                [ctx, errors] = yield PaymentBreakdown.handlePost(ctx, errors, formdata);
                assert.deepEqual(formdata.paymentPending, 'false');
                done();
            })
            .catch((err) => {
                done(err);
            });
        });

        it('sets nextStepUrl to payment-status if paymentPending is unknown', (done) => {
            const PaymentBreakdown = steps.PaymentBreakdown;
            let ctx = {total: 1};
            let errors = [];
            const formdata = {paymentPending: 'unknown'};

            co(function* () {
                [ctx, errors] = yield PaymentBreakdown.handlePost(ctx, errors, formdata);
                assert.equal(PaymentBreakdown.nextStepUrl(), '/payment-status');
                done();
            })
            .catch((err) => {
                done(err);
            });
        });

        it('sets paymentPending to true if ctx.total > 0', (done) => {
            const PaymentBreakdown = steps.PaymentBreakdown;
            let ctx = {total: 215};
            let errors = [];
            const formdata = {};
            const session = {};
            /*eslint no-empty-function: 0*/
            session.save = () => {};
            co(function* () {
                [ctx, errors] = yield PaymentBreakdown.handlePost(ctx, errors, formdata, session);
                assert.deepEqual(formdata.paymentPending, 'true');
                done();
            })
                .catch((err) => {
                    done(err);
                });
        });
    });

    describe('action', () => {
        it('cleans up context', () => {
            let ctx = {
                _csrf: 'dummyCSRF',
                sessionID: 'dummySessionID',
                authToken: 'dummyAuthToken',
                paymentError: 'dummyError',
                deceasedLastName: 'aName'
            };
            const PaymentBreakdown = steps.PaymentBreakdown;
            [ctx] = PaymentBreakdown.action(ctx);
            assert.deepEqual(ctx, {});
        });
    });
});
