'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorsDealingWithEstate = require('app/steps/ui/executors/dealingwithestate/index');
const ExecutorRoles = require('app/steps/ui/executors/roles/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

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
        testHelpBlockContent.runTest('ExecutorsApplying');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required');
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
