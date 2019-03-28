'use strict';

const config = require('app/config');
const TestWrapper = require('test/util/TestWrapper');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const IDAM_S2S_URL = config.services.idam.s2s_url;
const sinon = require('sinon');
const FeesCalculator = require('app/utils/FeesCalculator');
let feesCalculator;

const nock = require('nock');
const featureToggleUrl = config.featureToggles.url;
const feesApiFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.fees_api}`;
const featureTogglesNock = (status = 'true') => {
    nock(featureToggleUrl)
        .get(feesApiFeatureTogglePath)
        .reply(200, status);
};

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
            applicationfee: 250,
            applicationvalue: 6000,
            ukcopies: 1,
            ukcopiesfee: 10,
            overseascopies: 2,
            overseascopiesfee: 10.5,
            total: 270.50
        }));
        featureTogglesNock();
    });

    afterEach(() => {
        submitStub.close();
        testWrapper.destroy();
        nock.cleanAll();
        feesCalculator.restore();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('PaymentBreakdown', featureTogglesNock);

        it('test content loaded on the page with no extra copies', (done) => {
            const contentToExclude = ['extraCopiesFeeUk', 'extraCopiesFeeOverseas'];
            testWrapper.testContent(done, contentToExclude);
        });

        it('test it displays the UK copies fees', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({copies: {uk: 1}})
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const contentToExclude = ['extraCopiesFeeUk', 'extraCopiesFeeOverseas'];
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
                    const contentToExclude = ['extraCopiesFeeUk', 'extraCopiesFeeOverseas'];
                    testWrapper.testContent(done, contentToExclude);
                });
        });

        it('test error message displayed for failed authorisation', (done) => {
            testWrapper.agent.post('/prepare-session/featureToggles')
                .send({fees_api: true})
                .then(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send({fees: {
                                status: 'success',
                                applicationfee: 250,
                                applicationvalue: 60000,
                                ukcopies: 1,
                                ukcopiesfee: 10,
                                overseascopies: 2,
                                overseascopiesfee: 10.5,
                                total: 270.50
                            }})
                        .end((err) => {
                            if (err) {
                                throw err;
                            }
                            const data = {};
                            testWrapper.testErrors(done, data, 'failure', ['authorisation']);
                        });
                });
        });
    });
});
