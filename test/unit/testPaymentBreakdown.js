const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const co = require('co');

describe('PaymentBreakdown', function () {

    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']);

    describe('handleGet', function () {
        it('cleans up context', function () {
            const ctx = {
                paymentError: 'failure'
            };
            let errors = [];
            const PaymentBreakdown = steps.PaymentBreakdown;
            [, errors] = PaymentBreakdown.handleGet(ctx).next().value;

            assert.deepEqual(errors[0].param, 'payment');
        });
    });

    describe('handlePost', function () {
        it('sets paymentPending to false if ctx.total = 0', function (done) {

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

        it('sets nextStepUrl to payment-status if paymentPending is unknown', function (done) {

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

        it('sets paymentPending to true if ctx.total > 0', function (done) {
            const PaymentBreakdown = steps.PaymentBreakdown;
            let ctx = {total: 215};
            let errors = [];
            const formdata = {};
            const session = {};
            /*eslint no-empty-function: 0*/        
            session.save = function() {};
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

    describe('action', function () {
        it('cleans up context', function () {
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
