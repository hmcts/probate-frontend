'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('payment-status', () => {
    let testWrapper;
    let sessionData;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        sessionData = require('test/data/complete-form-undeclared').formdata;
        testWrapper = new TestWrapper('PaymentStatus');
    });

    afterEach(() => {
        delete require.cache[require.resolve('test/data/complete-form-undeclared')];
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('PaymentStatus');

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
