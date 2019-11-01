'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist');
const nock = require('nock');
const config = require('app/config');
const CREATE_PAYMENT_SERVICE_URL = config.services.payment.url + config.services.payment.paths.createPayment;
const IDAM_S2S_URL = config.services.idam.s2s_url;
const PERSISTENCE_URL = config.services.persistence.url;
const testCommonContent = require('test/component/common/testCommonContent.js');

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

    nock(PERSISTENCE_URL)
        .post('/')
        .reply(201, {});

    nock(IDAM_S2S_URL)
        .post('/lease')
        .reply(
            200,
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJSRUZFUkVOQ0UifQ.Z_YYn0go02ApdSMfbehsLXXbxJxLugPG8v_3ktCpQurK8tHkOy1qGyTo02bTdilX4fq4M5glFh80edDuhDJXPA'
        );
};

describe('payment-status', () => {
    let testWrapper;
    let sessionData;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        sessionData = require('test/data/complete-form-undeclared').formdata;

        testWrapper = new TestWrapper('PaymentStatus');

        paymentNock();
    });

    afterEach(() => {
        delete require.cache[require.resolve('test/data/complete-form-undeclared')];
        nock.cleanAll();
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('PaymentStatus');

        it('test right content loaded on the page when net value is greater than 5000£', (done) => {
            nock(config.services.orchestrator.url)
                .put(uri => uri.includes('submissions'))
                .reply(200, {
                    ccdCase: sessionData.ccdCase,
                    payment: sessionData.payment
                });

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentToExclude = ['paragraph2', 'paragraph3'];

                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test right content loaded on the page when net value is less than 5000£', (done) => {
            nock(config.services.orchestrator.url)
                .put(uri => uri.includes('submissions'))
                .reply(200, {
                    ccdCase: sessionData.ccdCase
                });
            const contentToExclude = ['paragraph1'];

            sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it(`test it redirects to next page with no input: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({})
                .end(() => {
                    testWrapper.testRedirect(done, {}, expectedNextUrlForTaskList);
                });
        });
    });
});
