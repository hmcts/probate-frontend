'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorsDealingWithEstate = require('app/steps/ui/executors/dealingwithestate');
const ExecutorRoles = require('app/steps/ui/executors/roles');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('executors-applying', () => {
    let testWrapper;
    const expectedNextUrlForExecDealingWith = ExecutorsDealingWithEstate.getUrl();
    const expectedNextUrlForExecRoles = ExecutorRoles.getUrl('*');

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsApplying');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ExecutorsApplying');

        it('test content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to ExecutorsDealingWithEstate if there are other executors dealing with the estate: ${expectedNextUrlForExecDealingWith}`, (done) => {
            const data = {
                otherExecutorsApplying: 'Yes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForExecDealingWith);
        });

        it(`test it redirects to executors roles if there are no other executors dealing with the estate: ${expectedNextUrlForExecRoles}`, (done) => {
            const data = {
                otherExecutorsApplying: 'No'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForExecRoles);
        });
    });
});
