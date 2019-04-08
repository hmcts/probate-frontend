// eslint-disable-line max-lines

'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const co = require('co');
const submitResponse = require('test/data/send-to-submit-service');
const journey = require('app/journeys/probate');
const rewire = require('rewire');
const PaymentBreakdown = rewire('app/steps/ui/payment/breakdown/index');
const config = require('app/config');
const nock = require('nock');
const sinon = require('sinon');
const FeesCalculator = require('app/utils/FeesCalculator');

describe('PaymentBreakdown', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const section = 'paymentBreakdown';
    const templatePath = 'payment/breakdown';
    const i18next = {};
    const schema = {
        $schema: 'http://json-schema.org/draft-04/schema#',
        properties: {}
    };
    let feesCalculator;

    describe('getContextData', () => {
        it('FT ON - should return the context with the deceased name', (done) => {
            const PaymentBreakdown = steps.PaymentBreakdown;
            const req = {
                sessionID: 'dummy_sessionId',
                authToken: 'dummy_token',
                userId: 'dummy_userId',
                session: {
                    form: {
                        journeyType: 'probate',
                        deceased: {
                            firstName: 'Dee',
                            lastName: 'Ceased'
                        }
                    },
                    featureToggles: {
                        fees_api: true
                    },
                    journeyType: 'probate'
                },
                query: {
                    status: 'dummy_status'
                }
            };

            const ctx = PaymentBreakdown.getContextData(req);
            expect(ctx).to.deep.equal({
                authToken: 'dummy_token',
                userId: 'dummy_userId',
                deceasedLastName: 'Ceased',
                paymentError: 'dummy_status',
                journeyType: 'probate',
                sessionID: 'dummy_sessionId',
                isFeesApiToggleEnabled: true
            });
            done();
        });
        it('FT OFF - should return the context with the deceased name', (done) => {
            const PaymentBreakdown = steps.PaymentBreakdown;
            const req = {
                sessionID: 'dummy_sessionId',
                authToken: 'dummy_token',
                userId: 'dummy_userId',
                session: {
                    form: {
                        journeyType: 'probate',
                        deceased: {
                            firstName: 'Dee',
                            lastName: 'Ceased'
                        }
                    },
                    featureToggles: {
                        fees_api: false
                    },
                    journeyType: 'probate'
                },
                query: {
                    status: 'dummy_status'
                }
            };

            const ctx = PaymentBreakdown.getContextData(req);
            expect(ctx).to.deep.equal({
                authToken: 'dummy_token',
                userId: 'dummy_userId',
                deceasedLastName: 'Ceased',
                paymentError: 'dummy_status',
                journeyType: 'probate',
                sessionID: 'dummy_sessionId',
                isFeesApiToggleEnabled: false
            });
            done();
        });
    });

    describe('handlePost', () => {
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
        let revertAuthorise;
        let expectedFormdata;
        let hostname;
        let ctxTestData;
        let errorsTestData;
        let session;

        beforeEach(() => {
            expectedFormdata = {
                ccdCase: {
                    id: 1535395401245028,
                    state: 'PaAppCreated'
                },
                creatingPayment: 'true',
                paymentPending: 'true',
                registry: {
                    registry: {
                        address: 'Line 1 Ox\nLine 2 Ox\nLine 3 Ox\nPostCode Ox\n',
                        email: 'oxford@email.com',
                        name: 'Oxford',
                        sequenceNumber: 10034
                    },
                    submissionReference: 97
                },
                submissionReference: 97
            };
            hostname = 'localhost';
            ctxTestData = {
                total: 215
            };
            errorsTestData = [];
            session = {
                save: () => true
            };
            revertAuthorise = PaymentBreakdown.__set__({
                Authorise: class {
                    post() {
                        return Promise.resolve({name: 'Success'});
                    }
                }
            });

            nock(config.services.submit.url)
                .post('/submit')
                .reply(200, submitResponse);

            feesCalculator = sinon.stub(FeesCalculator.prototype, 'calc');
        });

        afterEach(() => {
            revertAuthorise();
            nock.cleanAll();
            feesCalculator.restore();
        });

        it('FT ON - sets paymentPending to false if ctx.total = 0', (done) => {
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            let ctx = {
                isFeesApiToggleEnabled: true
            };
            let errors = [];
            const formdata = {
                fees: {
                    status: 'success',
                    applicationfee: 0,
                    applicationvalue: 4000,
                    ukcopies: 0,
                    ukcopiesfee: 0,
                    overseascopies: 0,
                    overseascopiesfee: 0,
                    total: 0
                }
            };

            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 0,
                applicationvalue: 4000,
                ukcopies: 0,
                ukcopiesfee: 0,
                overseascopies: 0,
                overseascopiesfee: 0,
                total: 0
            }));

            co(function* () {
                [ctx, errors] = yield paymentBreakdown.handlePost(ctx, errors, formdata);
                expect(formdata.paymentPending).to.equal('false');
                done();
            }).catch((err) => {
                done(err);
            });
        });
        it('FT OFF - sets paymentPending to false if ctx.total = 0', (done) => {
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            let ctx = {
                isFeesApiToggleEnabled: false
            };
            let errors = [];
            const formdata = {
                fees: {
                    status: 'success',
                    applicationfee: 0,
                    applicationvalue: 4000,
                    ukcopies: 0,
                    ukcopiesfee: 0,
                    overseascopies: 0,
                    overseascopiesfee: 0,
                    total: 0
                }
            };

            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 0,
                applicationvalue: 4000,
                ukcopies: 0,
                ukcopiesfee: 0,
                overseascopies: 0,
                overseascopiesfee: 0,
                total: 0
            }));

            co(function* () {
                [ctx, errors] = yield paymentBreakdown.handlePost(ctx, errors, formdata);
                expect(formdata.paymentPending).to.equal('false');
                done();
            }).catch((err) => {
                done(err);
            });
        });

        it('FT ON - sets nextStepUrl to payment-status if paymentPending is unknown', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            let ctx = {
                total: 1,
                isFeesApiToggleEnabled: true
            };
            let errors = [];
            const formdata = {
                paymentPending: 'unknown',
                fees: {
                    status: 'success',
                    applicationfee: 2500,
                    applicationvalue: 600000,
                    ukcopies: 1,
                    ukcopiesfee: 10,
                    overseascopies: 2,
                    overseascopiesfee: 10.5,
                    total: 2520.5
                }};

            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 2500,
                applicationvalue: 600000,
                ukcopies: 1,
                ukcopiesfee: 10,
                overseascopies: 2,
                overseascopiesfee: 10.5,
                total: 2520.5
            }));

            co(function* () {
                [ctx, errors] = yield paymentBreakdown.handlePost(ctx, errors, formdata);
                expect(paymentBreakdown.nextStepUrl(req)).to.equal('/payment-status');
                done();
            }).catch((err) => {
                done(err);
            });
        });
        it('FT OFF - sets nextStepUrl to payment-status if paymentPending is unknown', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            let ctx = {
                total: 1,
                isFeesApiToggleEnabled: false
            };
            let errors = [];
            const formdata = {
                paymentPending: 'unknown',
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 0.50,
                    overseascopies: 2,
                    overseascopiesfee: 1,
                    total: 216.50
                }};

            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 216.50
            }));

            co(function* () {
                [ctx, errors] = yield paymentBreakdown.handlePost(ctx, errors, formdata);
                expect(paymentBreakdown.nextStepUrl(req)).to.equal('/payment-status');
                done();
            }).catch((err) => {
                done(err);
            });
        });

        it('FT ON - sets paymentPending to true if ctx.total > 0', (done) => {
            const formdata = {
                creatingPayment: 'true',
                fees: {
                    status: 'success',
                    applicationfee: 2500,
                    applicationvalue: 600000,
                    ukcopies: 1,
                    ukcopiesfee: 10,
                    overseascopies: 2,
                    overseascopiesfee: 10.5,
                    total: 2520.5
                }
            };
            expectedFormdata.payment = {
                total: 2520.5
            };
            expectedFormdata.fees = {
                status: 'success',
                applicationfee: 2500,
                applicationvalue: 600000,
                ukcopies: 1,
                ukcopiesfee: 10,
                overseascopies: 2,
                overseascopiesfee: 10.5,
                total: 2520.5
            };
            ctxTestData.isFeesApiToggleEnabled = true;

            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 2500,
                applicationvalue: 600000,
                ukcopies: 1,
                ukcopiesfee: 10,
                overseascopies: 2,
                overseascopiesfee: 10.5,
                total: 2520.5
            }));

            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(formdata).to.deep.equal(expectedFormdata);
                expect(ctx).to.deep.equal(ctxTestData);
                expect(errors).to.deep.equal(errorsTestData);
                done();
            }).catch((err) => {
                done(err);
            });
        });
        it('FT OFF - sets paymentPending to true if ctx.total > 0', (done) => {
            const formdata = {
                creatingPayment: 'true',
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 0.50,
                    overseascopies: 2,
                    overseascopiesfee: 1,
                    total: 216.50
                }
            };
            expectedFormdata.payment = {
                total: 216.50
            };
            expectedFormdata.fees = {
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 216.50
            };
            ctxTestData.isFeesApiToggleEnabled = false;

            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 216.50
            }));

            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(formdata).to.deep.equal(expectedFormdata);
                expect(ctx).to.deep.equal(ctxTestData);
                expect(errors).to.deep.equal(errorsTestData);
                done();
            }).catch((err) => {
                done(err);
            });
        });

        it('FT ON - sets paymentPending to true if ctx.total > 0 and createPayment is false', (done) => {
            const revert = PaymentBreakdown.__set__({
                Payment: class {
                    post() {
                        return Promise.resolve([{
                            id: '24',
                            amount: 5000,
                            state: {
                                status: 'success',
                                finished: true
                            },
                            description: 'Probate Payment: 50',
                            reference: 'CODE4$$$Hill4314$$$CODE5$$$CODE2/100',
                            date_created: '2018-08-29T15:25:11.920+0000',
                            _links: {}
                        }, 1234]);
                    }
                }
            });
            const formdata = {
                creatingPayment: 'false',
                fees: {
                    status: 'success',
                    applicationfee: 2500,
                    applicationvalue: 600000,
                    ukcopies: 1,
                    ukcopiesfee: 10,
                    overseascopies: 2,
                    overseascopiesfee: 10.5,
                    total: 2520.5
                }
            };
            expectedFormdata.payment = {
                total: 2520.5
            };
            expectedFormdata.fees = {
                status: 'success',
                applicationfee: 2500,
                applicationvalue: 600000,
                ukcopies: 1,
                ukcopiesfee: 10,
                overseascopies: 2,
                overseascopiesfee: 10.5,
                total: 2520.5
            };
            ctxTestData.isFeesApiToggleEnabled = true;

            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 2500,
                applicationvalue: 600000,
                ukcopies: 1,
                ukcopiesfee: 10,
                overseascopies: 2,
                overseascopiesfee: 10.5,
                total: 2520.5
            }));

            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            expectedFormdata.creatingPayment = 'false';

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(formdata).to.deep.equal(expectedFormdata);
                expect(errors).to.deep.equal(errorsTestData);
                expect(ctx).to.deep.equal({
                    applicationFee: 2500,
                    copies: {
                        uk: {
                            cost: 10,
                            number: 1
                        },
                        overseas: {
                            cost: 10.5,
                            number: 2
                        }
                    },
                    total: 2520.5,
                    paymentId: 'CODE4$$$Hill4314$$$CODE5$$$CODE2/100',
                    paymentCreatedDate: '2018-08-29T15:25:11.920+0000',
                    paymentReference: 1234,
                    isFeesApiToggleEnabled: true
                });
                revert();
                done();
            }).catch((err) => {
                done(err);
            });
        });
        it('FT OFF - sets paymentPending to true if ctx.total > 0 and createPayment is false', (done) => {
            const revert = PaymentBreakdown.__set__({
                Payment: class {
                    post() {
                        return Promise.resolve([{
                            id: '24',
                            amount: 5000,
                            state: {
                                status: 'success',
                                finished: true
                            },
                            description: 'Probate Payment: 50',
                            reference: 'CODE4$$$Hill4314$$$CODE5$$$CODE2/100',
                            date_created: '2018-08-29T15:25:11.920+0000',
                            _links: {}
                        }, 1234]);
                    }
                }
            });
            const formdata = {
                creatingPayment: 'false',
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 0.50,
                    overseascopies: 2,
                    overseascopiesfee: 1,
                    total: 216.50
                }
            };
            expectedFormdata.payment = {
                total: 216.50
            };
            expectedFormdata.fees = {
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 216.50
            };
            ctxTestData.isFeesApiToggleEnabled = false;

            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 216.50
            }));

            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            expectedFormdata.creatingPayment = 'false';

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(formdata).to.deep.equal(expectedFormdata);
                expect(errors).to.deep.equal(errorsTestData);
                expect(ctx).to.deep.equal({
                    applicationFee: 215,
                    copies: {
                        uk: {
                            cost: 0.5,
                            number: 1
                        },
                        overseas: {
                            cost: 1,
                            number: 2
                        }
                    },
                    total: 216.50,
                    paymentId: 'CODE4$$$Hill4314$$$CODE5$$$CODE2/100',
                    paymentCreatedDate: '2018-08-29T15:25:11.920+0000',
                    paymentReference: 1234,
                    isFeesApiToggleEnabled: false
                });
                revert();
                done();
            }).catch((err) => {
                done(err);
            });
        });

        it('FT ON - Returns errror message if ctx.total > 0 and authorise service returns error', (done) => {
            const revert = PaymentBreakdown.__set__({
                Payment: class {
                    post() {
                        return Promise.resolve([{
                            id: '24',
                            amount: 5000,
                            state: {
                                status: 'success',
                                finished: true
                            },
                            description: 'Probate Payment: 50',
                            reference: 'CODE4$$$Hill4314$$$CODE5$$$CODE2/100',
                            date_created: '2018-08-29T15:25:11.920+0000',
                            _links: {}
                        }, 1234]);
                    }
                }
            });
            const formdata = {
                creatingPayment: 'false',
                fees: {
                    status: 'success',
                    applicationfee: 2500,
                    applicationvalue: 600000,
                    ukcopies: 1,
                    ukcopiesfee: 10,
                    overseascopies: 2,
                    overseascopiesfee: 10.5,
                    total: 2520.5
                }
            };
            expectedFormdata.payment = {
                total: 2520.5
            };
            expectedFormdata.fees = {
                status: 'success',
                applicationfee: 2500,
                applicationvalue: 600000,
                ukcopies: 1,
                ukcopiesfee: 10,
                overseascopies: 2,
                overseascopiesfee: 10.5,
                total: 2520.5
            };
            ctxTestData.isFeesApiToggleEnabled = true;

            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 2500,
                applicationvalue: 600000,
                ukcopies: 1,
                ukcopiesfee: 10,
                overseascopies: 2,
                overseascopiesfee: 10.5,
                total: 2520.5
            }));

            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            expectedFormdata.creatingPayment = 'false';

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(formdata).to.deep.equal(expectedFormdata);
                expect(errors).to.deep.equal(errorsTestData);
                expect(ctx).to.deep.equal({
                    applicationFee: 2500,
                    copies: {
                        uk: {
                            cost: 10,
                            number: 1
                        },
                        overseas: {
                            cost: 10.5,
                            number: 2
                        }
                    },
                    total: 2520.5,
                    paymentId: 'CODE4$$$Hill4314$$$CODE5$$$CODE2/100',
                    paymentReference: 1234,
                    paymentCreatedDate: '2018-08-29T15:25:11.920+0000',
                    isFeesApiToggleEnabled: true
                });
                revert();
                done();
            }).catch((err) => {
                done(err);
            });
        });
        it('FT OFF - Returns errror message if ctx.total > 0 and authorise service returns error', (done) => {
            const revert = PaymentBreakdown.__set__({
                Payment: class {
                    post() {
                        return Promise.resolve([{
                            id: '24',
                            amount: 5000,
                            state: {
                                status: 'success',
                                finished: true
                            },
                            description: 'Probate Payment: 50',
                            reference: 'CODE4$$$Hill4314$$$CODE5$$$CODE2/100',
                            date_created: '2018-08-29T15:25:11.920+0000',
                            _links: {}
                        }, 1234]);
                    }
                }
            });
            const formdata = {
                creatingPayment: 'false',
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 0.50,
                    overseascopies: 2,
                    overseascopiesfee: 1,
                    total: 216.50
                }
            };
            expectedFormdata.payment = {
                total: 216.50
            };
            expectedFormdata.fees = {
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 216.50
            };
            ctxTestData.isFeesApiToggleEnabled = false;

            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 216.50
            }));

            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            expectedFormdata.creatingPayment = 'false';

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(formdata).to.deep.equal(expectedFormdata);
                expect(errors).to.deep.equal(errorsTestData);
                expect(ctx).to.deep.equal({
                    applicationFee: 215,
                    copies: {
                        uk: {
                            cost: 0.5,
                            number: 1
                        },
                        overseas: {
                            cost: 1,
                            number: 2
                        }
                    },
                    total: 216.50,
                    paymentId: 'CODE4$$$Hill4314$$$CODE5$$$CODE2/100',
                    paymentReference: 1234,
                    paymentCreatedDate: '2018-08-29T15:25:11.920+0000',
                    isFeesApiToggleEnabled: false
                });
                revert();
                done();
            }).catch((err) => {
                done(err);
            });
        });

        it('FT ON - if sendToSubmitService returns DUPLICATE_SUBMISSION', (done) => {
            const stub = sinon
                .stub(PaymentBreakdown.prototype, 'sendToSubmitService')
                .returns([
                    'DUPLICATE_SUBMISSION',
                    [{
                        param: 'submit',
                        msg: {
                            summary: 'Your application has been submitted, please return to the tasklist to continue',
                            message: 'payment.breakdown.errors.submit.duplicate.message'
                        }
                    }]
                ]);

            const formdata = {
                creatingPayment: 'true',
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 0.50,
                    overseascopies: 2,
                    overseascopiesfee: 1,
                    total: 216.50
                }
            };
            ctxTestData.isFeesApiToggleEnabled = true;

            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 216.50
            }));
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(ctx).to.deep.equal({
                    total: 216.50,
                    applicationFee: 215,
                    copies: {
                        uk: {
                            cost: 0.5,
                            number: 1
                        },
                        overseas: {
                            cost: 1,
                            number: 2
                        }
                    },
                    isFeesApiToggleEnabled: true
                });
                expect(errors).to.deep.equal([{
                    param: 'submit',
                    msg: {
                        summary: 'Your application has been submitted, please return to the tasklist to continue',
                        message: 'payment.breakdown.errors.submit.duplicate.message'
                    }
                }]);
                stub.restore();
                done();
            }).catch((err) => {
                done(err);
            });
        });
        it('FT OFF - if sendToSubmitService returns DUPLICATE_SUBMISSION', (done) => {
            const stub = sinon
                .stub(PaymentBreakdown.prototype, 'sendToSubmitService')
                .returns([
                    'DUPLICATE_SUBMISSION',
                    [{
                        param: 'submit',
                        msg: {
                            summary: 'Your application has been submitted, please return to the tasklist to continue',
                            message: 'payment.breakdown.errors.submit.duplicate.message'
                        }
                    }]
                ]);

            const formdata = {
                creatingPayment: 'true',
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 0.50,
                    overseascopies: 2,
                    overseascopiesfee: 1,
                    total: 216.50
                }
            };
            ctxTestData.isFeesApiToggleEnabled = false;

            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 216.50
            }));
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(ctx).to.deep.equal({
                    total: 216.50,
                    applicationFee: 215,
                    copies: {
                        uk: {
                            cost: 0.5,
                            number: 1
                        },
                        overseas: {
                            cost: 1,
                            number: 2
                        }
                    },
                    isFeesApiToggleEnabled: false
                });
                expect(errors).to.deep.equal([{
                    param: 'submit',
                    msg: {
                        summary: 'Your application has been submitted, please return to the tasklist to continue',
                        message: 'payment.breakdown.errors.submit.duplicate.message'
                    }
                }]);
                stub.restore();
                done();
            }).catch((err) => {
                done(err);
            });
        });

        it('FT ON - sets paymentPending to true if ctx.total > 0 and payment exists with status of Success', (done) => {
            const revert = PaymentBreakdown.__set__({
                Payment: class {
                    get() {
                        return Promise.resolve(successfulPaymentResponse);
                    }
                }
            });
            const formdata = {
                creatingPayment: 'true',
                fees: {
                    status: 'success',
                    applicationfee: 2500,
                    applicationvalue: 600000,
                    ukcopies: 1,
                    ukcopiesfee: 10,
                    overseascopies: 2,
                    overseascopiesfee: 10.5,
                    total: 2520.5
                },
                payment: {
                    paymentId: 'RC-12345'
                }
            };
            expectedFormdata.payment = {
                total: 2520.5
            };
            expectedFormdata.fees = {
                status: 'success',
                applicationfee: 2500,
                applicationvalue: 600000,
                ukcopies: 1,
                ukcopiesfee: 10,
                overseascopies: 2,
                overseascopiesfee: 10.5,
                total: 2520.5
            };
            ctxTestData.isFeesApiToggleEnabled = true;

            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 2500,
                applicationvalue: 600000,
                ukcopies: 1,
                ukcopiesfee: 10,
                overseascopies: 2,
                overseascopiesfee: 10.5,
                total: 2520.5
            }));
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            expectedFormdata.payment.paymentId = 'RC-12345';

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(formdata).to.deep.equal(expectedFormdata);
                expect(ctx).to.deep.equal(ctxTestData);
                expect(errors).to.deep.equal(errorsTestData);
                revert();
                done();
            }).catch((err) => {
                done(err);
            });
        });
        it('FT OFF - sets paymentPending to true if ctx.total > 0 and payment exists with status of Success', (done) => {
            const revert = PaymentBreakdown.__set__({
                Payment: class {
                    get() {
                        return Promise.resolve(successfulPaymentResponse);
                    }
                }
            });
            const formdata = {
                creatingPayment: 'true',
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 0.50,
                    overseascopies: 2,
                    overseascopiesfee: 1,
                    total: 216.50
                },
                payment: {
                    paymentId: 'RC-12345'
                }
            };
            expectedFormdata.payment = {
                total: 216.50
            };
            expectedFormdata.fees = {
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 216.50
            };
            ctxTestData.isFeesApiToggleEnabled = false;

            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 216.50
            }));
            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            expectedFormdata.payment.paymentId = 'RC-12345';

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(formdata).to.deep.equal(expectedFormdata);
                expect(ctx).to.deep.equal(ctxTestData);
                expect(errors).to.deep.equal(errorsTestData);
                revert();
                done();
            }).catch((err) => {
                done(err);
            });
        });

        it('FT ON - sets paymentPending to true if ctx.total > 0 and payment exists with status of Initiated', (done) => {
            const revert = PaymentBreakdown.__set__({
                Payment: class {
                    get() {
                        return Promise.resolve(initiatedPaymentResponse);
                    }
                }
            });
            const formdata = {
                creatingPayment: 'true',
                fees: {
                    status: 'success',
                    applicationfee: 2500,
                    applicationvalue: 600000,
                    ukcopies: 1,
                    ukcopiesfee: 10,
                    overseascopies: 2,
                    overseascopiesfee: 10.5,
                    total: 2520.5
                },
                payment: {
                    paymentId: 'RC-12345'
                }
            };
            expectedFormdata.payment = {
                total: 2520.5
            };
            expectedFormdata.fees = {
                status: 'success',
                applicationfee: 2500,
                applicationvalue: 600000,
                ukcopies: 1,
                ukcopiesfee: 10,
                overseascopies: 2,
                overseascopiesfee: 10.5,
                total: 2520.5
            };
            ctxTestData.isFeesApiToggleEnabled = true;

            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            expectedFormdata.payment.paymentId = 'RC-12345';
            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 2500,
                applicationvalue: 600000,
                ukcopies: 1,
                ukcopiesfee: 10,
                overseascopies: 2,
                overseascopiesfee: 10.5,
                total: 2520.5
            }));

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(formdata).to.deep.equal(expectedFormdata);
                expect(ctx).to.deep.equal(ctxTestData);
                expect(errors).to.deep.equal(errorsTestData);
                revert();
                done();
            }).catch((err) => {
                done(err);
            });
        });
        it('FT OFF - sets paymentPending to true if ctx.total > 0 and payment exists with status of Initiated', (done) => {
            const revert = PaymentBreakdown.__set__({
                Payment: class {
                    get() {
                        return Promise.resolve(initiatedPaymentResponse);
                    }
                }
            });
            const formdata = {
                creatingPayment: 'true',
                fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 0.50,
                    overseascopies: 2,
                    overseascopiesfee: 1,
                    total: 216.50
                },
                payment: {
                    paymentId: 'RC-12345'
                }
            };
            expectedFormdata.payment = {
                total: 216.50
            };
            expectedFormdata.fees = {
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 216.50
            };
            ctxTestData.isFeesApiToggleEnabled = false;

            const paymentBreakdown = new PaymentBreakdown(steps, section, templatePath, i18next, schema);
            expectedFormdata.payment.paymentId = 'RC-12345';
            feesCalculator.returns(Promise.resolve({
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 216.50
            }));

            co(function* () {
                const [ctx, errors] = yield paymentBreakdown.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(formdata).to.deep.equal(expectedFormdata);
                expect(ctx).to.deep.equal(ctxTestData);
                expect(errors).to.deep.equal(errorsTestData);
                revert();
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });

    describe('action', () => {
        beforeEach(() => {
            feesCalculator = sinon.stub(FeesCalculator.prototype, 'calc');
        });

        afterEach(() => {
            feesCalculator.restore();
        });

        it('cleans up context', () => {
            let ctx = {
                _csrf: 'dummyCSRF',
                sessionID: 'dummySessionID',
                authToken: 'dummyAuthToken',
                paymentError: 'dummyError',
                deceasedLastName: 'aName',
                isFeesApiToggleEnabled: true
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
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 216.50
            }));
            [ctx] = paymentBreakdown.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });
    });
});
