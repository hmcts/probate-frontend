'use strict';

const TestWrapper = require('test/util/TestWrapper');
const testCommonContent = require('test/component/common/testCommonContent.js');
const sinon = require('sinon');
const FeesCalculator = require('app/utils/FeesCalculator');
let feesCalculator;

describe('payment-breakdown', () => {
    let testWrapper;
    let sessionData;

    beforeEach(() => {
        sessionData = {
            ccdCase: {
                state: 'Pending',
                id: 1234567890123456
            },
            declaration: {
                declarationCheckbox: 'true'
            }
        };

        testWrapper = new TestWrapper('PaymentBreakdown');

        feesCalculator = sinon.stub(FeesCalculator.prototype, 'calc');
        feesCalculator.returns(Promise.resolve({
            status: 'success',
            applicationfee: 215,
            applicationvalue: 6000,
            ukcopies: 1,
            ukcopiesfee: 1.50,
            overseascopies: 2,
            overseascopiesfee: 3,
            applicationversion: 0,
            applicationcode: 'FEE0226',
            ukcopiesversion: 2,
            ukcopiescode: 'FEE0003',
            overseascopiesversion: 3,
            overseascopiescode: 'FEE0003',
            total: 219.50
        }));
    });

    afterEach(async () => {
        await testWrapper.destroy();
        feesCalculator.restore();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('PaymentBreakdown', null, null, [], false, {declaration: {declarationCheckbox: 'true'}});

        it('test content loaded on the page with no extra copies', (done) => {
            const contentToExclude = ['extraCopiesFeeUk', 'extraCopiesFeeJersey', 'extraCopiesFeeOverseas'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    try {
                        testWrapper.testContent(done, {}, contentToExclude);
                    } catch (err) {
                        console.error(err.message);
                        done(err);
                    }
                });
        });

        it('test it displays the UK copies fees', (done) => {
            sessionData.copies = {
                uk: 1
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        done(err);
                        throw err;
                    }
                    const contentToExclude = ['extraCopiesFeeJersey', 'extraCopiesFeeOverseas'];

                    try {
                        testWrapper.testContent(done, {}, contentToExclude);
                    } catch (e) {
                        console.error(e.message);
                        done(e);
                    }
                });
        });

        it('test it displays the overseas copies fees', (done) => {
            sessionData.copies = {
                overseas: 1
            };
            sessionData.assets = {
                assetsoverseas: 'optionYes'
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        done(err);
                        throw err;
                    }
                    const contentToExclude = ['extraCopiesFeeJersey', 'extraCopiesFeeUk'];
                    try {
                        testWrapper.testContent(done, {}, contentToExclude);
                    } catch (e) {
                        console.error(e.message);
                        done(e);
                    }
                });
        });

        it('test error message displayed for failed authorisation', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 1.50,
                    overseascopies: 2,
                    overseascopiesfee: 3,
                    total: 219.50
                },
                declaration: {
                    declarationCheckbox: 'true'
                }})
                .end((err) => {
                    if (err) {
                        done(err);
                        throw err;
                    }
                    const errorsToTest = ['authorisation'];
                    try {
                        testWrapper.testErrors(done, {}, 'failure', errorsToTest);
                    } catch (e) {
                        console.error(e.message);
                        done(e);
                    }
                });
        });
    });
});
