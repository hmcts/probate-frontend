'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const co = require('co');
const rewire = require('rewire');
const PaymentStatus = rewire('app/steps/ui/payment/status/index');
const nock = require('nock');
const config = require('app/config');

describe('PaymentStatus', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/ui/`]);
    let section;
    let templatePath;
    let i18next;
    let schema;
    let revertPaymentBreakdown;
    let expectedFormData;
    let ctx;
    const successfulPaymentResponse = {
        channel: 'Online',
        id: 12345,
        reference: 'PaymentReference12345',
        amount: 5000,
        status: 'Success',
        date_updated: '2018-08-29T15:25:11.920+0000',
        site_id: 'siteId0001',
        external_reference: 12345
    };
    const initiatedPaymentResponse = {
        channel: 'Online',
        id: 12345,
        reference: 'PaymentReference12345',
        amount: 5000,
        status: 'Initiated',
        date_updated: '2018-08-29T15:25:11.920+0000',
        site_id: 'siteId0001',
        external_reference: 12345
    };
    const failedPaymentResponse = {
        channel: 'Online',
        id: 12345,
        reference: 'PaymentReference12345',
        amount: 5000,
        status: 'Failed',
        date_updated: '2018-08-29T15:25:11.920+0000',
        site_id: 'siteId0001',
        external_reference: 12345
    };
    let nockMock;

    beforeEach(() => {
        section = 'paymentStatus';
        templatePath = 'payment/status';
        i18next = {};
        schema = {
            $schema: 'http://json-schema.org/draft-04/schema#',
            properties: {}
        };
        revertPaymentBreakdown = PaymentStatus.__set__({
            Authorise: class {
                post() {
                    return Promise.resolve({});
                }
            }
        });
        expectedFormData = {
            'ccdCase': {
                'state': 'CaseCreated'
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
        ctx = {
            authToken: 'XXXXX',
            userId: 12345,
            paymentId: 4567
        };
        nockMock = nock(config.services.submit.url).post('/updatePaymentStatus');
    });

    afterEach(() => {
        revertPaymentBreakdown();
        nock.cleanAll();
    });

    describe('runnerOptions', () => {
        it('should set paymentPending to unknown if there is an authorise failure', (done) => {
            nockMock.reply(200, {caseState: 'CaseCreated'});

            ctx = {total: 1};

            const revert = PaymentStatus.__set__('Authorise', class {
                post() {
                    return Promise.resolve({name: 'Error'});
                }
            });
            const expectedOptions = {
                redirect: true,
                url: '/payment-breakdown?status=failure'
            };
            const expectedFormData = {
                paymentPending: 'unknown'
            };
            const formData = {paymentPending: 'true'};
            const paymentStatus = new PaymentStatus(steps, section, templatePath, i18next, schema);

            co(function* () {
                const options = yield paymentStatus.runnerOptions(ctx, formData);
                expect(options).to.deep.equal(expectedOptions);
                expect(formData).to.deep.equal(expectedFormData);
                revert();
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('should set redirect to false, paymentPending to false and payment status to success if payment is successful', (done) => {
            nockMock.reply(200, {caseState: 'CaseCreated'});

            const revert = PaymentStatus.__set__({
                Payment: class {
                    get() {
                        return Promise.resolve(successfulPaymentResponse);
                    }
                }
            });
            const formData = {paymentPending: 'true', 'payment': {}};
            const paymentStatus = new PaymentStatus(steps, section, templatePath, i18next, schema);

            co(function* () {
                const options = yield paymentStatus.runnerOptions(ctx, formData);
                expect(options.redirect).to.equal(false);
                expect(formData).to.deep.equal(expectedFormData);
                revert();
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('should set redirect to true, paymentPending to true and payment status to failure if payment is not successful', (done) => {
            nockMock.reply(200, {caseState: 'CaseCreated'});

            expectedFormData.payment.status = 'Failed';
            expectedFormData.paymentPending = 'true';

            const revert = PaymentStatus.__set__({
                Payment: class {
                    get() {
                        return Promise.resolve(failedPaymentResponse);
                    }
                }
            });
            const formData = {paymentPending: 'true', 'payment': {}};
            const paymentStatus = new PaymentStatus(steps, section, templatePath, i18next, schema);

            co(function* () {
                const options = yield paymentStatus.runnerOptions(ctx, formData);
                expect(options.redirect).to.equal(true);
                expect(options.url).to.equal('/payment-breakdown?status=failure');
                expect(formData).to.deep.equal(expectedFormData);
                revert();
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('should set payment status to not_required and redirect to false when paymentPending is false', (done) => {
            nockMock.reply(200, {caseState: 'CaseCreated'});

            const expectedFormData = {
                'ccdCase': {
                    'state': 'CaseCreated'
                },
                'payment': {
                    'status': 'not_required'
                },
                'paymentPending': 'false'
            };
            const formData = {paymentPending: 'false'};
            const paymentStatus = new PaymentStatus(steps, section, templatePath, i18next, schema);

            co(function* () {
                const options = yield paymentStatus.runnerOptions(ctx, formData);
                expect(options.redirect).to.equal(false);
                expect(formData).to.deep.equal(expectedFormData);
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('should return field error on options if updateCcdCasePaymentStatus returns error', (done) => {
            nockMock.reply(200, {name: 'Error'});

            const revert = PaymentStatus.__set__({
                Payment: class {
                    get() {
                        return Promise.resolve(successfulPaymentResponse);
                    }
                }
            });
            const formData = {paymentPending: 'false'};
            const paymentStatus = new PaymentStatus(steps, section, templatePath, i18next, schema);

            co(function* () {
                const options = yield paymentStatus.runnerOptions(ctx, formData);
                expect(options.errors).to.deep.equal([{
                    param: 'update',
                    msg: {
                        summary: 'We could not submit your application. Your data has been saved, please try again later.',
                        message: 'payment.status.errors.update.failure.message'
                    }
                }]);
                revert();
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('should set redirect to true, paymentPending to true and payment status to success if payment is successful with no case created', (done) => {
            delete expectedFormData.ccdCase;
            expectedFormData.payment.status = 'Initiated';
            expectedFormData.paymentPending = 'true';

            const revert = PaymentStatus.__set__({
                Payment: class {
                    get() {
                        return Promise.resolve(initiatedPaymentResponse);
                    }
                }
            });
            const formData = {paymentPending: 'true', 'payment': {}};
            const paymentStatus = new PaymentStatus(steps, section, templatePath, i18next, schema);

            co(function* () {
                const options = yield paymentStatus.runnerOptions(ctx, formData);
                expect(options.redirect).to.equal(true);
                expect(formData).to.deep.equal(expectedFormData);
                revert();
                done();
            }).catch(err => {
                done(err);
            });
        });
    });
});
