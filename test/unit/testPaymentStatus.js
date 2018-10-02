'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const co = require('co');
const services = require('app/components/services');
const sinon = require('sinon');

describe('PaymentStatus', () => {
    const steps = initSteps([__dirname + '/../../app/steps/ui/']);
    let servicesMock;

    const successfulPaymentResponse = {
        'channel': 'Online',
        'id': 12345,
        'reference': 'PaymentReference12345',
        'amount': 5000,
        'status': 'Success',
        'date_updated': '2018-08-29T15:25:11.920+0000',
        'site_id': 'siteId0001',
        'external_reference': 12345
    };

    const failedPaymentResponse = {
        'channel': 'Online',
        'id': 12345,
        'reference': 'PaymentReference12345',
        'amount': 5000,
        'status': 'Failed',
        'date_updated': '2018-08-29T15:25:11.920+0000',
        'site_id': 'siteId0001',
        'external_reference': 12345
    };

    const PaymentStatus = steps.PaymentStatus;

    beforeEach(function () {
        servicesMock = sinon.mock(services);
    });

    afterEach(function () {
        servicesMock.restore();
    });

    describe('runnerOptions', () => {

        it('should set paymentPending to unknown if there is an authorise failure',
            sinon.test((done) => {
                const expectedOptions = {
                    redirect: true,
                    url: '/payment-breakdown?status=failure'
                };
                const expectedFormData = {
                    paymentPending: 'unknown'
                };
                servicesMock.expects('authorise').returns(
                    Promise.resolve({name: 'Error'}));
                const ctx = {total: 1};
                const formData = {paymentPending: 'true'};
                co(function* () {
                    const options = yield PaymentStatus.runnerOptions(ctx, formData);

                    assert.deepEqual(options, expectedOptions);
                    assert.deepEqual(formData, expectedFormData);

                    servicesMock.expects('findPayment').never();
                    servicesMock.expects('updateCcdCasePaymentStatus').never();
                    done();
                }).catch(err => {
                    done(err);
                });
            }));

        it('should set redirect to false, paymentPending to false and payment status to success if payment is successful',
            sinon.test((done) => {
                const expectedFormData = {
                    'ccdCase': {
                        'state': 'caseCreated'
                    },
                    'paymentPending': 'false',
                    'payment': {
                        'amount': 5000,
                        'channel': 'Online',
                        'date': '2018-08-29T15:25:11.920+0000',
                        'reference': 'PaymentReference12345',
                        'siteId': 'siteId0001',
                        'status': 'Success',
                        'transactionId': 12345
                    }
                };
                servicesMock.expects('authorise').returns(Promise.resolve({}));
                servicesMock.expects('findPayment').returns(
                    Promise.resolve(successfulPaymentResponse));
                servicesMock.expects('updateCcdCasePaymentStatus').returns(
                    Promise.resolve({'caseState': 'caseCreated'}));
                const ctx = {
                    authToken: 'XXXXX',
                    userId: 12345,
                    paymentId: 4567
                };
                const formData = {paymentPending: 'true', 'payment': {}};
                co(function* () {
                    const options = yield PaymentStatus.runnerOptions(ctx, formData);
                    assert.deepEqual(options.redirect, false);
                    assert.deepEqual(formData, expectedFormData);
                    servicesMock.expects('findPayment').never();
                    servicesMock.expects('authorise').never();
                    servicesMock.expects('updateCcdCasePaymentStatus').never();
                    done();
                }).catch(err => {
                    done(err);
                });
            }));

        it('should set redirect to true, paymentPending to true and payment status to failure if payment is not successful',
            sinon.test((done) => {
                const expectedFormData = {
                    'ccdCase': {
                        'state': 'caseCreated'
                    },
                    'paymentPending': 'true',
                    'payment': {
                        'amount': 5000,
                        'channel': 'Online',
                        'date': '2018-08-29T15:25:11.920+0000',
                        'reference': 'PaymentReference12345',
                        'siteId': 'siteId0001',
                        'status': 'Failed',
                        'transactionId': 12345
                    }
                };
                servicesMock.expects('authorise').returns(Promise.resolve({}));
                servicesMock.expects('findPayment').returns(
                    Promise.resolve(failedPaymentResponse));
                servicesMock.expects('updateCcdCasePaymentStatus').returns(
                    Promise.resolve({'caseState': 'caseCreated'}));

                const ctx = {
                    authToken: 'XXXXX',
                    userId: 12345,
                    paymentId: 4567
                };
                const formData = {paymentPending: 'true', 'payment': {}};
                co(function* () {
                    const options = yield PaymentStatus.runnerOptions(ctx, formData);
                    assert.deepEqual(options.redirect, true);
                    assert.deepEqual(options.url, '/payment-breakdown?status=failure');
                    assert.deepEqual(formData, expectedFormData);
                    servicesMock.expects('findPayment').once();
                    servicesMock.expects('authorise').once();
                    servicesMock.expects('updateCcdCasePaymentStatus').never();
                    done();
                }).catch(err => {
                    done(err);
                });
            }));

        it('should set payment status to not_required and redirect to false when paymentPending is false',
            sinon.test((done) => {
                const expectedFormData = {
                    'ccdCase': {
                        'state': 'caseCreated'
                    },
                    'payment': {
                        'status': 'not_required'
                    },
                    'paymentPending': 'false'
                };

                servicesMock.expects('authorise').returns(Promise.resolve({}));
                servicesMock.expects('findPayment').returns(Promise.resolve({}));
                servicesMock.expects('updateCcdCasePaymentStatus').returns(
                    Promise.resolve({'caseState': 'caseCreated'}));

                const ctx = {
                    authToken: 'XXXXX',
                    userId: 12345,
                    paymentId: 4567
                };

                const formData = {paymentPending: 'false'};
                co(function* () {
                    const options = yield PaymentStatus.runnerOptions(ctx, formData);
                    assert.deepEqual(options.redirect, false);
                    assert.deepEqual(formData, expectedFormData);
                    servicesMock.expects('findPayment').never();
                    servicesMock.expects('authorise').once();
                    servicesMock.expects('updateCcdCasePaymentStatus').never();
                    done();
                }).catch(err => {
                    done(err);
                });
            }));

        it('should return field error on options if updateCcdCasePaymentStatus returns error', sinon.test((done) => {
            servicesMock.expects('authorise').returns(Promise.resolve({}));
            servicesMock.expects('findPayment').returns(
                Promise.resolve(successfulPaymentResponse));
            servicesMock.expects('updateCcdCasePaymentStatus').returns(
                Promise.resolve({name: 'Error'}));

            const ctx = {
                authToken: 'XXXXX',
                userId: 12345,
                paymentId: 4567
            };

            const formData = {paymentPending: 'false'};
            co(function* () {
                const options = yield PaymentStatus.runnerOptions(ctx, formData);
                assert.deepEqual(options.errors, [{
                    param: 'update',
                    msg: {
                        summary: 'We could not submit your application. Your data has been saved, please try again later.',
                        message: 'payment.status.errors.update.failure.message'
                    }
                }]);
                servicesMock.expects('findPayment').once();
                servicesMock.expects('authorise').once();
                servicesMock.expects('updateCcdCasePaymentStatus').once();
                done();
            }).catch(err => {
                done(err);
            });
        }));
    });

});
