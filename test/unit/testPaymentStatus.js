const initSteps = require('app/core/initSteps'),
    assert = require('chai').assert,
    co = require('co');

describe('PaymentStatus', function () {

    const steps = initSteps([__dirname + '/../../app/steps/ui/']);

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

        it('Should not crete an error if sendApplication succeeds', function (done) {

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