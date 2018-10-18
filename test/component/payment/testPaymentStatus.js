const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist/index');
const sessionData = require('test/data/complete-form-undeclared').formdata;
const nock = require('nock');
const config = require('app/config');
const SUBMIT_SERVICE_URL = config.services.submit.url;
const CREATE_PAYMENT_SERVICE_URL = config.services.payment.createPaymentUrl;
const USER_ID = config.services.payment.userId;
const IDAM_S2S_URL = config.services.idam.s2s_url;
const PERSISTENCE_URL = config.services.persistence.url;

describe('payment-status', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('PaymentStatus');

        nock(SUBMIT_SERVICE_URL).post('/updatePaymentStatus')
            .reply(200, {caseState: 'CreatedCase'});
        nock(`${CREATE_PAYMENT_SERVICE_URL.replace('userId', USER_ID)}`).get('/1')
            .reply(200, {
                'channel': 'Online',
                'id': 12345,
                'reference': 'PaymentReference12345',
                'amount': 5000,
                'status': 'Success',
                'date_updated': '2018-08-29T15:25:11.920+0000',
                'site_id': 'siteId0001',
            });
        nock(PERSISTENCE_URL).post('/')
            .reply(201, {});
        nock(IDAM_S2S_URL).post('/lease')
            .reply(200, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJSRUZFUkVOQ0UifQ.Z_YYn0go02ApdSMfbehsLXXbxJxLugPG' +
                '8v_3ktCpQurK8tHkOy1qGyTo02bTdilX4fq4M5glFh80edDuhDJXPA');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page when net value is greater than 5000£', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = ['paragraph2', 'paragraph3'];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test right content loaded on the page when net value is less than 5000£', (done) => {
            const excludeKeys = ['paragraph'];

            testWrapper.testContent(done, excludeKeys);
        });

        it(`test it redirects to next page with no input: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, {}, expectedNextUrlForTaskList);
                });
        });
    });
});
