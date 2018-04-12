const TestWrapper = require('test/util/TestWrapper'),
    ExecutorsWithOtherNames = require('app/steps/ui/executors/othername/index'),
    ExecutorContactDetails = require('app/steps/ui/executors/contactdetails/index');

describe('executors-alias', () => {
    let testWrapper;
    const expectedNextUrlForExecOtherNames = ExecutorsWithOtherNames.getUrl();
    const expectedNextUrlForExecContactDetails = ExecutorContactDetails.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsAlias');

    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required');
        });

        it(`test it redirects to Executor Other Names when Yes: ${expectedNextUrlForExecOtherNames}`, (done) => {
            const data = {
                'alias': 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForExecOtherNames);
        });

        it(`test it redirects to Executor Contact Details when No: ${expectedNextUrlForExecContactDetails}`, (done) => {
            const data = {
                'alias': 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForExecContactDetails);
        });

    });
});
