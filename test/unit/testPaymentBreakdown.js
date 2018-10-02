'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const co = require('co');
const services = require('app/components/services');
const sinon = require('sinon');
const submitResponse = require('test/data/send-to-submit-service');

describe('PaymentBreakdown', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    let authoriseStub;
    let sendToSubmitServiceStub;
    let createPaymentStub;

    beforeEach(function () {
        authoriseStub = sinon.stub(services, 'authorise');
        sendToSubmitServiceStub = sinon.stub(services, 'sendToSubmitService');
        createPaymentStub = sinon.stub(services, 'createPayment');
    });

    afterEach(function () {
        authoriseStub.restore();
        sendToSubmitServiceStub.restore();
        createPaymentStub.restore();
    });

    describe('handlePost', () => {
        it('sets paymentPending to false if ctx.total = 0', (done) => {
            sendToSubmitServiceStub.returns(submitResponse);
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
            sendToSubmitServiceStub.returns(submitResponse);
            const PaymentBreakdown = steps.PaymentBreakdown;
            const hostname = 'localhost';
            const ctxTestData = {total: 215};
            const errorsTestData = [];
            const formdata = {
                creatingPayment: 'true'
            };
            const session = {
                save: () => true
            };

            co(function* () {
                const [ctx, errors] = yield PaymentBreakdown.handlePost(ctxTestData,
                    errorsTestData, formdata, session, hostname);
                assert.deepEqual(formdata, {
                    'ccdCase': {
                        'id': 1535395401245028,
                        'state': 'PaAppCreated'

            },
                    'creatingPayment': 'true',
                    'payment': {
                        'total': 215
                    },
                    'paymentPending': 'true',
                    'registry': {
                        'registry': {
                            'address': 'Line 1 Ox\nLine 2 Ox\nLine 3 Ox\nPostCode Ox\n',
                            'email': 'oxford@email.com',
                            'name': 'Oxford',
                            'sequenceNumber': 10034
                        },
                        'submissionReference': 97
                    },
                    'submissionReference': 97
                });
                assert.deepEqual(ctx, ctxTestData);
                assert.equal(errors, errorsTestData);
                done();
            })
                .catch((err) => {
                    done(err);
                });
        });

        it('sets paymentPending to true if ctx.total > 0 and createPayment is false', (done) => {
            sendToSubmitServiceStub.returns(submitResponse);
            authoriseStub.returns(Promise.resolve({name: 'Success'}));
            createPaymentStub.returns(Promise.resolve([{
                'id': '24',
                'amount': 5000,
                'state': {
                    'status': 'success',
                    'finished': true
                },
                'description': 'Probate Payment: 50',
                'reference': 'CODE4$$$Hill4314$$$CODE5$$$CODE2/100',
                'date_created': '2018-08-29T15:25:11.920+0000',
                '_links': {}
            }, 1234]));
            const PaymentBreakdown = steps.PaymentBreakdown;
            const hostname = 'localhost';
            const ctxTestData = {total: 215};
            const errorsTestData = [];
            const formdata = {
                creatingPayment: 'false'
            };
            const session = {
                save: () => true
            };

            co(function* () {
                const [ctx, errors] = yield PaymentBreakdown.handlePost(ctxTestData,
                    errorsTestData, formdata, session, hostname);
                assert.deepEqual(formdata, {
                    'ccdCase': {
                        'id': 1535395401245028,
                        'state': 'PaAppCreated'
                    },
                    'creatingPayment': 'false',
                    'payment': {
                        'total': 215
                    },
                    'paymentPending': 'true',
                    'registry': {
                        'registry': {
                            'address': 'Line 1 Ox\nLine 2 Ox\nLine 3 Ox\nPostCode Ox\n',
                            'email': 'oxford@email.com',
                            'name': 'Oxford',
                            'sequenceNumber': 10034
                        },
                        'submissionReference': 97
                    },
                    'submissionReference': 97
                });
                assert.equal(errors, errorsTestData);
                assert.deepEqual(ctx, {
                    'total': 215,
                    'paymentId': 'CODE4$$$Hill4314$$$CODE5$$$CODE2/100',
                    'paymentCreatedDate': '2018-08-29T15:25:11.920+0000',
                    'paymentReference': 1234
                });
                done();
            })
                .catch((err) => {
                    done(err);
                });
        });

        it('Returns errror message if ctx.total > 0 and authorise service returns error', (done) => {
            sendToSubmitServiceStub.returns(submitResponse);
            authoriseStub.returns(Promise.resolve({name: 'Success'}));
            createPaymentStub.returns(Promise.resolve([{
                'id': '24',
                'amount': 5000,
                'state': {
                    'status': 'success',
                    'finished': true
                },
                'description': 'Probate Payment: 50',
                'reference': 'CODE4$$$Hill4314$$$CODE5$$$CODE2/100',
                'date_created': '2018-08-29T15:25:11.920+0000',
                '_links': {}
            }, 1234]));
            const PaymentBreakdown = steps.PaymentBreakdown;
            const hostname = 'localhost';
            const ctxTestData = {total: 215};
            const errorsTestData = [];
            const formdata = {
                creatingPayment: 'false'
            };
            const session = {
                save: () => true
            };

            co(function* () {
                const [ctx, errors] = yield PaymentBreakdown.handlePost(ctxTestData,
                    errorsTestData, formdata, session, hostname);
                assert.deepEqual(formdata, {
                    'ccdCase': {
                        'id': 1535395401245028,
                        'state': 'PaAppCreated'
                    },
                    'creatingPayment': 'false',
                    'payment': {
                        'total': 215
                    },
                    'paymentPending': 'true',
                    'registry': {
                        'registry': {
                            'address': 'Line 1 Ox\nLine 2 Ox\nLine 3 Ox\nPostCode Ox\n',
                            'email': 'oxford@email.com',
                            'name': 'Oxford',
                            'sequenceNumber': 10034
                        },
                        'submissionReference': 97
                    },
                    'submissionReference': 97
                });
                assert.equal(errors, errorsTestData);
                assert.deepEqual(ctx, {
                    'total': 215,
                    'paymentId': 'CODE4$$$Hill4314$$$CODE5$$$CODE2/100',
                    'paymentReference': 1234,
                    'paymentCreatedDate': '2018-08-29T15:25:11.920+0000'
                });
                done();
            })
                .catch((err) => {
                    done(err);
                });
        });

        it('if sendToSubmitService returns DUPLICATE_SUBMISSION', (done) => {
            sendToSubmitServiceStub.returns(Promise.resolve('DUPLICATE_SUBMISSION'));
            const PaymentBreakdown = steps.PaymentBreakdown;
            const hostname = 'localhost';
            const ctxTestData = {total: 215};
            const errorsTestData = [];
            const formdata = {
                creatingPayment: 'true'
            };
            const session = {
                save: () => true
            };
            co(function* () {
                const [ctx, errors] = yield PaymentBreakdown.handlePost(
                    ctxTestData, errorsTestData, formdata, session, hostname);
                assert.deepEqual(ctx, {total: 215});
                assert.deepEqual(errors, [{
                    param: 'submit',
                    msg: {
                        summary: 'Your application has been submitted, please return to the tasklist to continue',
                        message: 'payment.breakdown.errors.submit.duplicate.message'
                    }
                }]);
                done();
            }).catch(err => {
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
