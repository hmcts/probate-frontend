'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const co = require('co');
const services = require('app/components/services');
const sinon = require('sinon');

describe('PaymentStatus', () => {
    const steps = initSteps([__dirname + '/../../app/steps/ui/']);

    describe('runnerOptions', () => {
        it('should set paymentPending to unknown if there is an authorise failure', (done) => {
            const authoriseStub = sinon
                .stub(services, 'authorise')
                .returns(Promise.resolve({name: 'Error'}));
            const PaymentStatus = steps.PaymentStatus;
            const ctx = {total: 1};
            const formdata = {paymentPending: 'true'};
            co(function* () {
                const options = yield PaymentStatus.runnerOptions(ctx, formdata);
                assert.deepEqual(options, {
                    redirect: true,
                    url: '/payment-breakdown?status=failure'
                });
                assert.deepEqual(formdata, {
                    paymentPending: 'unknown'
                });
                authoriseStub.restore();
                done();
            }).catch(err => {
                done(err);
            });
        });
    });

    describe('sendApplication', () => {
        let submitApplicationStub;

        beforeEach(() => {
            submitApplicationStub = sinon.stub(services, 'submitApplication');
        });

        afterEach(() => {
            submitApplicationStub.restore();
        });

        describe('should return an error', () => {
            it('if submitApplication returns "Error"', (done) => {
                submitApplicationStub.returns(Promise.resolve({name: 'Error'}));
                const PaymentStatus = steps.PaymentStatus;
                const ctx = {};
                const formdata = {};
                co(function * () {
                    const errors = yield PaymentStatus.sendApplication(ctx, formdata);
                    assert.deepEqual(errors, [{
                        param: 'submit',
                        msg: {
                            summary: 'We could not submit your application. Your data has been saved, please try again later.',
                            message: 'payment.status.errors.submit.failure.message'
                        }
                    }]);
                    done();
                }).catch(err => {
                    done(err);
                });
            });

            it('if submitApplication returns "DUPLICATE_SUBMISSION"', (done) => {
                submitApplicationStub.returns(Promise.resolve('DUPLICATE_SUBMISSION'));
                const PaymentStatus = steps.PaymentStatus;
                const ctx = {};
                const formdata = {};
                co(function * () {
                    const errors = yield PaymentStatus.sendApplication(ctx, formdata);
                    assert.deepEqual(errors, [{
                        param: 'submit',
                        msg: {
                            summary: 'Your application has been submitted, please return to the tasklist to continue',
                            message: 'payment.status.errors.submit.duplicate.message'
                        }
                    }]);
                    done();
                }).catch(err => {
                    done(err);
                });
            });
        });

        it('should not return an error if submitApplication returns successfully', (done) => {
            submitApplicationStub.returns(Promise.resolve({name: 'Success'}));
            const saveFormDataStub = sinon
                .stub(services, 'saveFormData')
                .returns(Promise.resolve({name: 'Success'}));
            const PaymentStatus = steps.PaymentStatus;
            const ctx = {};
            const formdata = {};
            co(function * () {
                const errors = yield PaymentStatus.sendApplication(ctx, formdata);
                assert.isUndefined(errors);
                saveFormDataStub.restore();
                done();
            }).catch(err => {
                done(err);
            });
        });
    });
});
