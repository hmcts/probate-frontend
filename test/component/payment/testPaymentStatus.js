const TestWrapper = require('test/util/TestWrapper'),
    TaskList = require('app/steps/ui/tasklist/index'),
    sessionData = require('test/data/complete-form-undeclared').formdata;
const nock = require('nock');
const config = require('app/config');
const SUBMIT_SERVICE_URL = config.services.submit.url;
const CREATE_PAYMENT_SERVICE_URL = config.services.payment.createPaymentUrl;
const USER_ID = config.services.payment.userId;

describe('payment-status', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
      testWrapper = new TestWrapper('PaymentStatus');

      nock(SUBMIT_SERVICE_URL).post('/updatePaymentStatus')
        .reply(200, {});
      nock(`${CREATE_PAYMENT_SERVICE_URL.replace('userId', USER_ID)}`).get('/1')
        .reply(200, {
        'state': {
          'status': 'success'
        }
      });
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
