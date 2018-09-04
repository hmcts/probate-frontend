'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist/index');
const sessionData = require('test/data/complete-form-undeclared').formdata;

describe('payment-status', () => {
    let testWrapper;
    let submitStub, s2sStub, payStub;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    before(() => {
        submitStub = require('test/service-stubs/submit');
        s2sStub = require('test/service-stubs/idam');
        payStub = require('test/service-stubs/payment');
    });

    after(() => {
        submitStub.close();
        s2sStub.close();
        payStub.close();
        delete require.cache[require.resolve('test/service-stubs/submit')];
        delete require.cache[require.resolve('test/service-stubs/idam')];
        delete require.cache[require.resolve('test/service-stubs/payment')];
    });

    beforeEach(() => {
        testWrapper = new TestWrapper('PaymentStatus');
    });

    afterEach(() => {
        testWrapper.destroy();
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
