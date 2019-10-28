// eslint-disable-line max-lines
'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const co = require('co');
const rewire = require('rewire');
const PaymentStatus = rewire('app/steps/ui/payment/status');
const nock = require('nock');
const caseTypes = require('app/utils/CaseTypes');
const content = require('app/resources/en/translation/payment/status');

describe('PaymentStatus', () => {
    const steps = initSteps([`${__dirname}/../../../app/steps/ui`]);
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

    const revertSubmitData = ((formData) => {
        PaymentStatus.__set__('ServiceMapper', class {
            static map() {
                return class {
                    static submit() {
                        return Promise.resolve(formData);
                    }
                };
            }
        });
    });

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
            reference: 4567,
            paymentDue: true
        };
    });

    afterEach(() => {
        revertPaymentBreakdown();
        revertSubmitData();
        nock.cleanAll();
    });

    describe('runnerOptions', () => {
        it('redirect if there is an authorise failure', (done) => {
            revertSubmitData(expectedFormData);
            ctx = {
                total: 1,
                paymentDue: true
            };

            const revert = PaymentStatus.__set__('Authorise', class {
                post() {
                    return Promise.resolve({name: 'Error'});
                }
            });
            const expectedOptions = {
                redirect: true,
                url: '/payment-breakdown?status=failure'
            };
            const formData = {};
            const paymentStatus = new PaymentStatus(steps, section, templatePath, i18next, schema);

            co(function* () {
                const options = yield paymentStatus.runnerOptions(ctx, formData);
                expect(options).to.deep.equal(expectedOptions);
                revert();
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('should set redirect to false if payment is successful', (done) => {
            revertSubmitData(expectedFormData);

            const revert = PaymentStatus.__set__({
                Payment: class {
                    get() {
                        return Promise.resolve(successfulPaymentResponse);
                    }
                }
            });
            const formData = {'payment': {}};
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

        it('should set redirect to true and payment status to failure if payment is not successful', (done) => {
            revertSubmitData(expectedFormData);

            expectedFormData.payment.status = 'Failed';
            expectedFormData.ccdCase.state = 'CasePaymentFailed';

            const revert = PaymentStatus.__set__({
                Payment: class {
                    get() {
                        return Promise.resolve(failedPaymentResponse);
                    }
                }
            });
            const formData = {'payment': {}};
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

        it('should set payment status to not_required and redirect to false when paymentDue is false', (done) => {
            const expectedFormData = {
                caseType: 'gop',
                ccdCase: {
                    state: 'CaseCreated'
                },
                payment: {
                    status: 'not_required'
                }
            };

            revertSubmitData(expectedFormData);

            ctx = {
                authToken: 'XXXXX',
                userId: 12345,
                reference: 4567,
                paymentDue: false
            };

            const formData = {caseType: caseTypes.GOP};
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

        it('should return validation error if paymentPending is true', (done) => {
            revertSubmitData({type: 'VALIDATION'});
            ctx = {
                authToken: 'XXXXX',
                userId: 12345,
                reference: 4567,
                paymentDue: false,
                paymentPending: true
            };

            expectedFormData = {
                payment: undefined,
                ccdCase: undefined
            };

            const formData = {};
            const paymentStatus = new PaymentStatus(steps, section, templatePath, i18next, schema);
            co(function* () {
                const options = yield paymentStatus.runnerOptions(ctx, formData);
                expect(formData).to.deep.equal(expectedFormData);
                expect(options.redirect).to.equal(false);
                expect(options.errors).to.deep.equal([{
                    field: 'update',
                    href: '#update',
                    msg: {
                        summary: content.errors.update.failure.summary,
                        message: content.errors.update.failure.message
                    }
                }]);
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('should return field error on options if submit returns error', (done) => {
            revertSubmitData({name: 'Error'});

            const revert = PaymentStatus.__set__({
                Payment: class {
                    get() {
                        return Promise.resolve(successfulPaymentResponse);
                    }
                }
            });

            ctx = {
                authToken: 'XXXXX',
                userId: 12345,
                reference: 4567,
                paymentDue: false
            };

            const formData = {};
            const paymentStatus = new PaymentStatus(steps, section, templatePath, i18next, schema);

            co(function* () {
                const options = yield paymentStatus.runnerOptions(ctx, formData);
                expect(options.errors).to.deep.equal([{
                    field: 'update',
                    href: '#update',
                    msg: {
                        summary: content.errors.update.failure.summary,
                        message: content.errors.update.failure.message
                    }
                }]);
                revert();
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('should set redirect to true  payment status to success if payment is successful with no case created', (done) => {
            delete expectedFormData.ccdCase;
            revertSubmitData(expectedFormData);
            expectedFormData.payment.status = 'Initiated';

            const revert = PaymentStatus.__set__({
                Payment: class {
                    get() {
                        return Promise.resolve(initiatedPaymentResponse);
                    }
                }
            });
            const formData = {'payment': {}};
            const paymentStatus = new PaymentStatus(steps, section, templatePath, i18next, schema);

            co(function* () {
                const options = yield paymentStatus.runnerOptions(ctx, formData);
                expect(options.redirect).to.equal(true);
                revert();
                done();
            }).catch(err => {
                done(err);
            });
        });
    });
});
