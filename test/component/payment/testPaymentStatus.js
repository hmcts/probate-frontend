'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist');
const nock = require('nock');
const config = require('app/config');
const SUBMIT_SERVICE_URL = config.services.submit.url;
const CREATE_PAYMENT_SERVICE_URL = config.services.payment.url + config.services.payment.paths.createPayment;
const IDAM_S2S_URL = config.services.idam.s2s_url;
const PERSISTENCE_URL = config.services.persistence.url;
const testCommonContent = require('test/component/common/testCommonContent.js');

const beforeEachCallback = () => {
    nock(SUBMIT_SERVICE_URL).post('/updatePaymentStatus')
        .reply(200, {caseState: 'CreatedCase'});
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
const afterEachCallback = () => {
    nock.cleanAll();
};

describe('payment-status', () => {
    let testWrapper;
    let sessionData;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        sessionData = require('test/data/complete-form-undeclared').formdata;
        testWrapper = new TestWrapper('PaymentStatus');
        beforeEachCallback();
    });

    afterEach(() => {
        delete require.cache[require.resolve('test/data/complete-form-undeclared')];
        testWrapper.destroy();
        afterEachCallback();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('PaymentStatus', beforeEachCallback, afterEachCallback);

        it('test right content loaded on the page when net value is greater than 5000£', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentToExclude = ['paragraph2', 'paragraph3'];

                    testWrapper.testContent(done, contentToExclude);
                });
        });

        it('test right content loaded on the page when net value is less than 5000£', (done) => {
            const contentToExclude = ['paragraph1'];

            testWrapper.testContent(done, contentToExclude);
        });

        it(`test it redirects to next page with no input: ${expectedNextUrlForTaskList}`, (done) => {
            sessionData = {};
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, {}, expectedNextUrlForTaskList);
                });
        });
    });
});
