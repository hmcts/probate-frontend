'use strict';

const nock = require('nock');
const config = require('app/config');
const TestWrapper = require('test/util/TestWrapper');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const IDAM_S2S_URL = config.services.idam.s2s_url;
const sinon = require('sinon');
const FeesCalculator = require('app/utils/FeesCalculator');
let feesCalculator;

describe('payment-breakdown', () => {
    let testWrapper;
    let submitStub;

    beforeEach(() => {
        submitStub = require('test/service-stubs/submit');
        testWrapper = new TestWrapper('PaymentBreakdown');
        nock(IDAM_S2S_URL).post('/lease')
            .reply(200, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJSRUZFUkVOQ0UifQ.Z_YYn0go02ApdSMfbehsLXXbxJxLugPG' +
                '8v_3ktCpQurK8tHkOy1qGyTo02bTdilX4fq4M5glFh80edDuhDJXPA');
        feesCalculator = sinon.stub(FeesCalculator.prototype, 'calc');
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
    });

    afterEach(() => {
        submitStub.close();
        testWrapper.destroy();
        nock.cleanAll();
        feesCalculator.restore();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('PaymentBreakdown');

        it('test content loaded on the page with no extra copies', (done) => {
            const contentToExclude = ['extraCopiesFeeUk', 'extraCopiesFeeJersey', 'extraCopiesFeeOverseas'];
            testWrapper.testContent(done, contentToExclude);
        });

        it('test it displays the UK copies fees', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({copies: {uk: 1}})
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const contentToExclude = ['extraCopiesFeeJersey', 'extraCopiesFeeOverseas'];
                    testWrapper.testContent(done, contentToExclude);
                });
        });

        it('test it displays the overseas copies fees', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({copies: {overseas: 1}, assets: {assetsoverseas: 'Yes'}})
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const contentToExclude = ['extraCopiesFeeJersey', 'extraCopiesFeeUk'];
                    testWrapper.testContent(done, contentToExclude);
                });
        });

        it('test error message displayed for failed authorisation', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({fees: {
                    status: 'success',
                    applicationfee: 215,
                    applicationvalue: 6000,
                    ukcopies: 1,
                    ukcopiesfee: 0.50,
                    overseascopies: 2,
                    overseascopiesfee: 1,
                    total: 216.50
                }})
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    // const contentToExclude = ['extraCopiesFeeJersey', 'extraCopiesFeeUk'];
                    const data = {};
                    testWrapper.testErrors(done, data, 'failure', ['authorisation']);
                });

        });
    });
});
