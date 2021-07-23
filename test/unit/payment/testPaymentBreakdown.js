// eslint-disable-line max-lines

'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const co = require('co');
const journey = require('app/journeys/probate');
const rewire = require('rewire');
const PaymentBreakdown = rewire('app/steps/ui/payment/breakdown');
const sinon = require('sinon');
const FeesCalculator = require('app/utils/FeesCalculator');
const Payment = require('app/services/Payment');
const caseTypes = require('app/utils/CaseTypes');
const content = require('app/resources/en/translation/payment/breakdown');
const i18next = require('i18next');

describe('PaymentBreakdown', () => {
    const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
    const section = 'paymentBreakdown';
    const templatePath = 'payment/breakdown';
    const schema = {
        $schema: 'http://json-schema.org/draft-04/schema#',
        properties: {}
    };
    let feesCalculator;

    describe('handlePost', () => {
        const postInitiatedCardPayment = [{
            id: '24',
            amount: 5000,
            status: 'Initiated',
            description: 'Probate Payment: 50',
            reference: 'RC-1234-5678-9012-3456',
            date_created: '2018-08-29T15:25:11.920+0000',
            _links: {}
        }];
        const successfulCasePaymentsResponse = {
            payments: [{
                amount: 219.50,
                ccd_case_number: '1535395401245028',
                payment_reference: 'RC-67890',
                status: 'Success'
            }]
        };
        const initiatedCasePaymentsResponse = {
            payments: [{
                amount: 219.50,
                ccd_case_number: '1535395401245028',
                payment_reference: 'RC-67890',
                status: 'Initiated'
            }]
        };
        const successPaymentResponse = {
            channel: 'Online',
            amount: 5000,
            ccd_case_number: '1535395401245028',
            payment_reference: 'RC-67890',
            status: 'Success',
            date_updated: '2018-08-29T15:25:11.920+0000',
            site_id: 'siteId0001',
            external_reference: 12345
        };
        const initiatedPaymentResponse = {
            channel: 'Online',
            amount: 5000,
            ccd_case_number: '1535395401245028',
            payment_reference: 'RC-67890',
            status: 'Initiated',
            date_updated: '2018-08-29T15:25:11.920+0000',
            site_id: 'siteId0001',
            external_reference: 12345
        };
        let revertAuthorise;
        let expectedPaymentFormdata;
        let expectedPaAppCreatedFormdata;
        let hostname;
        let ctxTestData;
        let errorsTestData;
        let session;

        beforeEach(() => {
            expectedPaAppCreatedFormdata = {
                ccdCase: {
                    id: 1535395401245028,
                    state: 'PaAppCreated'
                },
                payment: {
                    total: 219.50
                },
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 1.50,
                    overseascopies: 2,
                    overseascopiesfee: 3,
                    applicationcode: 'FEE0226',
                    applicationversion: 1,
                    ukcopiescode: 'FEE0003',
                    ukcopiesversion: 2,
                    overseascopiescode: 'FEE0003',
                    overseascopiesversion: 3,
                    total: 219.50
                },
                registry: {
                    registry: {
                        address: 'Line 1 Ox\nLine 2 Ox\nLine 3 Ox\nPostCode Ox\n',
                        email: 'oxford@email.com',
                        name: 'Oxford',
                        sequenceNumber: 10034
                    }
                },
            };
            expectedPaymentFormdata = {
                payment: {
                    total: 219.50
                },
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 1.50,
                    overseascopies: 2,
                    overseascopiesfee: 3,
                    applicationcode: 'FEE0226',
                    applicationversion: 1,
                    ukcopiescode: 'FEE0003',
                    ukcopiesversion: 2,
                    overseascopiescode: 'FEE0003',
                    overseascopiesversion: 3,
                    total: 219.50
                }
            };
            hostname = 'localhost';
            ctxTestData = {
                total: 215,
                ccdCase: {
                    id: 0
                },
                caseType: caseTypes.GOP
            };
            errorsTestData = [];
            session = {
                language: 'en',
                save: () => true
            };
            revertAuthorise = PaymentBreakdown.__set__({
                Authorise: class {
                    post() {
                        return Promise.resolve({name: 'Success'});
                    }
                }
            });

            feesCalculator = sinon.stub(FeesCalculator.prototype, 'calc');
        });

        afterEach(() => {
            revertAuthorise();
            feesCalculator.restore();
        });

        it('sets reference if ctx.total > 0 and payment exists with status of Initiated', (done) => {
            const getCasePaymentsStub = sinon
                .stub(Payment.prototype, 'getCasePayments')
                .returns({});
            const postStub = sinon
                .stub(Payment.prototype, 'post')
                .returns(postInitiatedCardPayment);
            const formdata = {
                ccdCase: {
                    id: 1535395401245028,
                    state: 'PaAppCreated'
                },
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 1.50,
                    overseascopies: 2,
                    overseascopiesfee: 3,
                    total: 219.50
                }
            };
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            expectedPaAppCreatedFormdata.payment.reference = 'RC-1234-5678-9012-3456';
            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 1.50,
                overseascopies: 2,
                overseascopiesfee: 3,
                applicationcode: 'FEE0226',
                applicationversion: 1,
                ukcopiescode: 'FEE0003',
                ukcopiesversion: 2,
                overseascopiescode: 'FEE0003',
                overseascopiesversion: 3,
                total: 219.50
            }));

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(ctx).to.deep.equal(ctxTestData);
                expect(errors).to.deep.equal(errorsTestData);
                getCasePaymentsStub.restore();
                postStub.restore();
                done();
            }).catch((err) => {
                getCasePaymentsStub.restore();
                postStub.restore();
                done(err);
            });
        });

        it('sets nextStepUrl to payment-status if ctx.total = 0', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            let ctx = {
                total: 0,
                ccdCase: {
                    id: 0
                }
            };
            let errors = [];
            const formdata = {
                fees: {
                    total: 0,
                    ukcopiesfee: 0,
                    overseascopiesfee: 0,
                    applicationfee: 0
                }
            };

            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 0,
                ukcopiesfee: 0.00,
                overseascopies: 0,
                overseascopiesfee: 0,
                applicationcode: 'FEE0226',
                applicationversion: 1,
                ukcopiescode: '',
                ukcopiesversion: 0,
                overseascopiescode: '',
                overseascopiesversion: 0,
                total: 0.0
            }));

            co(function* () {
                [ctx, errors] = yield paymentBreakdown.handlePost(ctx, errors, formdata, session, hostname);
                expect(paymentBreakdown.nextStepUrl(req)).to.equal('/payment-status');
                expect(errors).to.deep.equal(errorsTestData);
                done();
            }).catch((err) => {
                done(err);
            });
        });

        it('sets nextStepUrl to payment-status if payment.status is Success', (done) => {
            const getCasePaymentsStub = sinon
                .stub(Payment.prototype, 'getCasePayments')
                .returns(successfulCasePaymentsResponse);
            const req = {
                session: {
                    journey: journey
                }
            };
            const formdata = {
                ccdCase: {
                    id: 1535395401245028,
                    state: 'CaseCreated'
                },
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 1.50,
                    overseascopies: 2,
                    overseascopiesfee: 3,
                    total: 219.50
                },
                payment: {
                    reference: 'RC-12345'
                }
            };
            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 1.50,
                overseascopies: 2,
                overseascopiesfee: 3,
                applicationcode: 'FEE0226',
                applicationversion: 1,
                ukcopiescode: 'FEE0003',
                ukcopiesversion: 2,
                overseascopiescode: 'FEE0003',
                overseascopiesversion: 3,
                total: 219.50
            }));
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);

            let ctx = {
                total: 215,
                ccdCase: {
                    id: 0
                }
            };
            let errors = [];

            co(function* () {
                [ctx, errors] = yield paymentBreakdown.handlePost(ctx, errors, formdata, session, hostname);
                expect(paymentBreakdown.nextStepUrl(req)).to.equal('/payment-status');
                expect(errors).to.deep.equal(errorsTestData);
                getCasePaymentsStub.restore();
                done();
            }).catch((err) => {
                getCasePaymentsStub.restore();
                done(err);
            });
        });

        it('if ctx.total > 0 and the formdata does not contain a payment.reference', (done) => {
            const postStub = sinon
                .stub(Payment.prototype, 'post')
                .returns(postInitiatedCardPayment);
            const formdata = {
                ccdCase: {
                    id: 1535395401245028,
                    state: 'PaAppCreated'
                },
                copies: {
                    uk: 1,
                    overseas: 2
                },
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 1.50,
                    overseascopies: 2,
                    overseascopiesfee: 3,
                    total: 219.50
                }
            };
            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 1.50,
                overseascopies: 2,
                overseascopiesfee: 3,
                applicationcode: 'FEE0226',
                applicationversion: 1,
                ukcopiescode: 'FEE0003',
                ukcopiesversion: 2,
                overseascopiescode: 'FEE0003',
                overseascopiesversion: 3,
                total: 219.50
            }));

            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            expectedPaAppCreatedFormdata.payment.reference = 'RC-1234-5678-9012-3456';
            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(errors).to.deep.equal(errorsTestData);
                expect(ctx).to.deep.equal({
                    caseType: 'gop',
                    applicationFee: '215.00',
                    ccdCase: {
                        id: 0
                    },
                    copies: {
                        uk: {
                            cost: '1.50',
                            number: 1
                        },
                        overseas: {
                            cost: '3.00',
                            number: 2
                        }
                    },
                    applicationcode: 'FEE0226',
                    applicationversion: 1,
                    ukcopiescode: 'FEE0003',
                    ukcopiesversion: 2,
                    overseascopiescode: 'FEE0003',
                    overseascopiesversion: 3,
                    total: '219.50'
                });
                postStub.restore();
                done();
            }).catch((err) => {
                postStub.restore();
                done(err);
            });
        });

        it('Returns error message if ctx.total > 0 and authorise service returns error', (done) => {
            revertAuthorise = PaymentBreakdown.__set__({
                Authorise: class {
                    post() {
                        return Promise.resolve({name: 'Error'});
                    }
                }
            });
            const formdata = {
                ccdCase: {
                    id: 1535395401245028,
                    state: 'PaAppCreated'
                },
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 1.50,
                    overseascopies: 2,
                    overseascopiesfee: 3,
                    total: 219.50
                }
            };
            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 1.50,
                overseascopies: 2,
                overseascopiesfee: 3,
                applicationcode: 'FEE0226',
                applicationversion: 1,
                ukcopiescode: 'FEE0003',
                ukcopiesversion: 2,
                overseascopiescode: 'FEE0003',
                overseascopiesversion: 3,
                total: 219.50
            }));

            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(errors).to.deep.equal([{
                    field: 'authorisation',
                    href: '#authorisation',
                    msg: content.errors.authorisation.failure
                }]);
                expect(ctx).to.deep.equal(ctxTestData);
                revertAuthorise();
                done();
            }).catch((err) => {
                done(err);
            });
        });

        it('sets reference if ctx.total > 0 and payment exists with status of Success', (done) => {
            const getCasePaymentsStub = sinon
                .stub(Payment.prototype, 'getCasePayments')
                .returns(successfulCasePaymentsResponse);
            const formdata = {
                ccdCase: {
                    id: 1535395401245028,
                    state: 'PaAppCreated'
                },
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 1.50,
                    overseascopies: 2,
                    overseascopiesfee: 3,
                    applicationcode: 'FEE0226',
                    applicationversion: 1,
                    ukcopiescode: 'FEE0003',
                    ukcopiesversion: 2,
                    overseascopiescode: 'FEE0003',
                    overseascopiesversion: 3,
                    total: 219.50
                },
                payment: {
                    reference: 'RC-1234-5678-9012-3456',
                    total: 219.5
                },
                registry: {
                    registry: {
                        address: 'Line 1 Ox\nLine 2 Ox\nLine 3 Ox\nPostCode Ox\n',
                        email: 'oxford@email.com',
                        name: 'Oxford',
                        sequenceNumber: 10034
                    }
                }
            };
            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 1.50,
                overseascopies: 2,
                overseascopiesfee: 3,
                applicationcode: 'FEE0226',
                applicationversion: 1,
                ukcopiescode: 'FEE0003',
                ukcopiesversion: 2,
                overseascopiescode: 'FEE0003',
                overseascopiesversion: 3,
                total: 219.50
            }));
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            expectedPaAppCreatedFormdata.payment.reference = 'RC-67890';

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(formdata).to.deep.equal(expectedPaAppCreatedFormdata);
                expect(ctx).to.deep.equal(ctxTestData);
                expect(errors).to.deep.equal(errorsTestData);
                getCasePaymentsStub.restore();
                done();
            }).catch((err) => {
                getCasePaymentsStub.restore();
                done(err);
            });
        });

        it('set ctx.reference to a previous successful reference for a case.', (done) => {
            const caseSuccessPaymentResponse = {
                'payments': [{
                    'amount': 219.50,
                    'ccd_case_number': '1535395401245028',
                    'payment_reference': 'RC-12345',
                    'status': 'Failed'
                }, {
                    'amount': 219.50,
                    'ccd_case_number': '1535395401245028',
                    'payment_reference': 'RC-67890',
                    'status': 'Success'
                }]
            };
            const identifySuccessfulOrInitiatedPaymentResponse = {
                'amount': 219.50,
                'ccd_case_number': '1535395401245028',
                'payment_reference': 'RC-67890',
                'status': 'Success'
            };
            const revert = PaymentBreakdown.__set__({
                Payment: class {
                    getCasePayments() {
                        return caseSuccessPaymentResponse;
                    }
                    identifySuccessfulOrInitiatedPayment() {
                        return identifySuccessfulOrInitiatedPaymentResponse;
                    }
                }
            });
            const formdata = {
                ccdCase: {
                    id: 1535395401245028,
                    state: 'PaAppCreated'
                },
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 1.50,
                    overseascopies: 2,
                    overseascopiesfee: 3,
                    applicationcode: 'FEE0226',
                    applicationversion: 1,
                    ukcopiescode: 'FEE0003',
                    ukcopiesversion: 2,
                    overseascopiescode: 'FEE0003',
                    overseascopiesversion: 3,
                    total: 219.50
                },
                payment: {
                    reference: 'RC-12345',
                    total: 219.50
                },
                registry: {
                    registry: {
                        address: 'Line 1 Ox\nLine 2 Ox\nLine 3 Ox\nPostCode Ox\n',
                        email: 'oxford@email.com',
                        name: 'Oxford',
                        sequenceNumber: 10034
                    }
                }
            };
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            expectedPaAppCreatedFormdata.payment.reference = 'RC-67890';
            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 1.50,
                overseascopies: 2,
                overseascopiesfee: 3,
                applicationcode: 'FEE0226',
                applicationversion: 1,
                ukcopiescode: 'FEE0003',
                ukcopiesversion: 2,
                overseascopiescode: 'FEE0003',
                overseascopiesversion: 3,
                total: 219.50
            }));

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(formdata).to.deep.equal(expectedPaAppCreatedFormdata);
                expect(ctx).to.deep.equal(ctxTestData);
                expect(ctx.reference).to.equal('RC-67890');
                expect(errors).to.deep.equal(errorsTestData);
                revert();
                done();
            }).catch((err) => {
                done(err);
            });
        });

        it('show initiated error when a ctx.reference has been proven to be still in an initiated state.', (done) => {
            const getCasePaymentsStub = sinon
                .stub(Payment.prototype, 'getCasePayments')
                .returns(initiatedCasePaymentsResponse);
            const getStub = sinon
                .stub(Payment.prototype, 'get')
                .returns(initiatedPaymentResponse);
            const formdata = {
                ccdCase: {
                    id: 1535395401245028,
                    state: 'PAPaymentFailed'
                },
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 1.50,
                    overseascopies: 2,
                    overseascopiesfee: 3,
                    applicationcode: 'FEE0226',
                    applicationversion: 1,
                    ukcopiescode: 'FEE0003',
                    ukcopiesversion: 2,
                    overseascopiescode: 'FEE0003',
                    overseascopiesversion: 3,
                    total: 219.50
                },
                payment: {
                    reference: 'RC-12345'
                }
            };
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            expectedPaymentFormdata.payment.reference = 'RC-12345';
            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 1.50,
                overseascopies: 2,
                overseascopiesfee: 3,
                applicationcode: 'FEE0226',
                applicationversion: 1,
                ukcopiescode: 'FEE0003',
                ukcopiesversion: 2,
                overseascopiescode: 'FEE0003',
                overseascopiesversion: 3,
                total: 219.50
            }));

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(ctx).to.deep.equal(ctxTestData);
                expect(ctx.reference).to.equal('RC-67890');
                expect(errors).to.deep.equal([{
                    field: 'payment',
                    href: '#payment',
                    msg: content.errors.payment.initiated
                }]);
                getCasePaymentsStub.restore();
                getStub.restore();
                done();
            }).catch((err) => {
                getCasePaymentsStub.restore();
                getStub.restore();
                done(err);
            });
        });

        it('show success when a ctx.reference was initiated state but has now expired.', (done) => {
            const getCasePaymentsStub = sinon
                .stub(Payment.prototype, 'getCasePayments')
                .returns(initiatedCasePaymentsResponse);
            const getStub = sinon
                .stub(Payment.prototype, 'get')
                .returns(successPaymentResponse);
            const formdata = {
                ccdCase: {
                    id: 1535395401245028,
                    state: 'PAPaymentFailed'
                },
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 1.50,
                    overseascopies: 2,
                    overseascopiesfee: 3,
                    total: 219.50
                },
                payment: {
                    reference: 'RC-12345'
                }
            };
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            expectedPaymentFormdata.payment.reference = 'RC-12345';
            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 1.50,
                overseascopies: 2,
                overseascopiesfee: 3,
                applicationcode: 'FEE0226',
                applicationversion: 1,
                ukcopiescode: 'FEE0003',
                ukcopiesversion: 2,
                overseascopiescode: 'FEE0003',
                overseascopiesversion: 3,
                total: 219.50
            }));

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(ctx).to.deep.equal(ctxTestData);
                expect(ctx.reference).to.equal('RC-67890');
                expect(errors).to.deep.equal(errorsTestData);
                getCasePaymentsStub.restore();
                getStub.restore();
                done();
            }).catch((err) => {
                getCasePaymentsStub.restore();
                getStub.restore();
                done(err);
            });
        });
    });

    describe('Tests formatting of fee and copies amounts', () => {
        it('test that fees and copies that are whole numbers have trailing .00', () => {
            let ctx = {
                applicationFee: 200,
                total: 209,
                copies: {
                    uk: {cost: 3},
                    overseas: {cost: 6}
                },
                applicationcode: 'FEE0226',
                applicationversion: 1,
                ukcopiescode: 'FEE0003',
                ukcopiesversion: 2,
                overseascopiescode: 'FEE0003',
                overseascopiesversion: 3
            };
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            ctx = paymentBreakdown.formatAmounts(ctx);
            expect(ctx.applicationFee).to.equal('200.00');
            expect(ctx.total).to.equal('209.00');
            expect(ctx.copies.uk.cost).to.equal('3.00');
            expect(ctx.copies.overseas.cost).to.equal('6.00');
            expect(ctx.applicationcode).to.equal('FEE0226');
            expect(ctx.applicationversion).to.equal(1);
            expect(ctx.ukcopiescode).to.equal('FEE0003');
            expect(ctx.ukcopiesversion).to.equal(2);
            expect(ctx.overseascopiescode).to.equal('FEE0003');
            expect(ctx.overseascopiesversion).to.equal(3);
        });

        it('test that if fees and copies have a single decimal point they are convert to 2 decimal places', () => {
            let ctx = {
                applicationFee: 200.0,
                total: 207.5,
                copies: {
                    uk: {cost: 3},
                    overseas: {cost: 4.5}
                }
            };
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            ctx = paymentBreakdown.formatAmounts(ctx);
            expect(ctx.applicationFee).to.equal('200.00');
            expect(ctx.total).to.equal('207.50');
            expect(ctx.copies.uk.cost).to.equal('3.00');
            expect(ctx.copies.overseas.cost).to.equal('4.50');
        });

        it('test that if fees and copies have two decimal places they are retured with two decimal places', () => {
            let ctx = {
                applicationFee: 200.00,
                total: 207.50,
                copies: {
                    uk: {cost: 3.00},
                    overseas: {cost: 4.50}
                },
                applicationcode: 'FEE0226',
                applicationversion: 1,
                ukcopiescode: 'FEE0003',
                ukcopiesversion: 2,
                overseascopiescode: 'FEE0003',
                overseascopiesversion: 3
            };
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            ctx = paymentBreakdown.formatAmounts(ctx);
            expect(ctx.applicationFee).to.equal('200.00');
            expect(ctx.total).to.equal('207.50');
            expect(ctx.copies.uk.cost).to.equal('3.00');
            expect(ctx.copies.overseas.cost).to.equal('4.50');
            expect(ctx.applicationcode).to.equal('FEE0226');
            expect(ctx.applicationversion).to.equal(1);
            expect(ctx.ukcopiescode).to.equal('FEE0003');
            expect(ctx.ukcopiesversion).to.equal(2);
            expect(ctx.overseascopiescode).to.equal('FEE0003');
            expect(ctx.overseascopiesversion).to.equal(3);
        });
    });

    describe('action', () => {
        beforeEach(() => {
            feesCalculator = sinon.stub(FeesCalculator.prototype, 'calc');
        });

        afterEach(() => {
            feesCalculator.restore();
        });

        it('test it cleans up context', () => {
            let ctx = {
                _csrf: 'dummyCSRF',
                sessionID: 'dummySessionID',
                authToken: 'dummyAuthToken',
                paymentError: 'dummyError',
                deceasedLastName: 'aName',
            };
            const formdata = {
                fees: 'fees object'
            };
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 1.50,
                overseascopies: 2,
                overseascopiesfee: 3,
                applicationcode: 'FEE0226',
                applicationversion: 1,
                ukcopiescode: 'FEE0003',
                ukcopiesversion: 2,
                overseascopiescode: 'FEE0003',
                overseascopiesversion: 3,
                total: 219.50
            }));
            [ctx] = paymentBreakdown.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });
    });
});
