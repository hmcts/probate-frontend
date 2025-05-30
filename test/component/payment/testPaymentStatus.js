'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist');
const nock = require('nock');
const config = require('config');
const CREATE_PAYMENT_SERVICE_URL = config.services.payment.url + config.services.payment.paths.createPayment;
const IDAM_S2S_URL = config.services.idam.s2s_url;

const paymentNock = () => {
    nock(CREATE_PAYMENT_SERVICE_URL)
        .get('/1')
        .reply(200, {
            channel: 'Online',
            id: 12345,
            reference: 'PaymentReference12345',
            amount: 5000,
            status: 'Success',
            date_updated: '2018-08-29T15:25:11.920+0000',
            site_id: 'siteId0001',
        });

    nock(IDAM_S2S_URL)
        .post('/lease')
        .reply(
            200,
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJSRUZFUkVOQ0UifQ.Z_YYn0go02ApdSMfbehsLXXbxJxLugPG8v_3ktCpQurK8tHkOy1qGyTo02bTdilX4fq4M5glFh80edDuhDJXPA'
        );
};

const commonContentNock = () => {
    nock(config.services.orchestrator.url)
        .put(uri => uri.includes('submissions'))
        .reply(200, {
            ccdCase: {
                state: 'CasePrinted',
                id: 1234567890123456
            },
            payment: {
                total: 0
            }
        });
};

describe('payment-status', () => {
    let testWrapper;
    let sessionData;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        sessionData = require('test/data/complete-form-undeclared').formdata;
        sessionData.declaration = {
            declarationCheckbox: 'true'
        };

        testWrapper = new TestWrapper('PaymentStatus');
        commonContentNock();
        paymentNock();
    });

    afterEach(() => {
        delete require.cache[require.resolve('test/data/complete-form-undeclared')];
        nock.cleanAll();
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it(`test it redirects to next page with no input: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({})
                .end(() => {
                    testWrapper.testRedirect(done, {}, expectedNextUrlForTaskList);
                });
        });

        it('test it redirects to thank-you', (done) => {
            const singleApplicantSessionData = {
                ccdCase: {
                    state: 'CasePrinted',
                    id: 1234567890123456
                },
                payment: {
                    status: 'Success',
                    reference: '1234'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(singleApplicantSessionData)
                .end(() => {
                    testWrapper.testRedirect(done, singleApplicantSessionData, '/thank-you');
                });
        });
    });
});
