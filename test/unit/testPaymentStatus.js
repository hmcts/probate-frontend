const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const config = require('test/config');
const co = require('co');

describe('PaymentStatus', function () {

    const steps = initSteps([__dirname + '/../../app/steps/ui/']);

    describe('runnerOptions', function () {
        it('Should set paymentPending to unknown if an authorise failure', function (done) {

            config.s2sStubErrorSequence = '1';
            require('test/service-stubs/idam');

            const PaymentStatus = steps.PaymentStatus;
            let ctx = {total: 1};
            let errors = [];
            let options = {}
            const formdata = {paymentPending: 'true'};

            co(function* () {
                options = yield PaymentStatus.runnerOptions(ctx, formdata);
                assert.equal(options.redirect, true);
                assert.equal(options.url, '/payment-breakdown?status=failure');
                assert.equal(formdata.paymentPending, 'unknown');
                done();
            })
                .catch((err) => {
                done(err);
            });
        });
    });

    describe('sendApplication', function () {
        it('Should create an error if the sendApplication fails', function (done) {

            const PaymentStatus = steps.PaymentStatus;
            const ctx = {};
            const formdata = {};
            co(function * () {
                const errors = yield PaymentStatus.sendApplication(ctx, formdata);
                assert.exists(errors[0].msg, 'error message not found');
                done();
            }).catch((err) => {
                done(err);
            });
        });

        it('Should not create an error if sendApplication succeeds', function (done) {

            require('test/service-stubs/submit');

            const PaymentStatus = steps.PaymentStatus;
            const ctx = {};
            const formdata = {};
            co(function * () {
                const errors = yield PaymentStatus.sendApplication(ctx, formdata);
                assert.notExists(errors);
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });
});
