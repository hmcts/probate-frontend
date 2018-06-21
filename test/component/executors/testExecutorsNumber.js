const TestWrapper = require('test/util/TestWrapper'),
    DeceasedName = require('app/steps/ui/deceased/name/index'),
    ExecutorsNames = require('app/steps/ui/executors/names/index');

describe.only('executors-number', () => {
    let testWrapper;
    const expectedNextUrlForExecNames = ExecutorsNames.getUrl();
    const expectedNextUrlForDeceasedName = DeceasedName.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsNumber');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it('test errors message displayed for invalid data', (done) => {
            const data = {executorsNumber: 'abd'};

            testWrapper.testErrors(done, data, 'invalid', []);
        });

        it('test errors message displayed for invalid data - negative numbers', (done) => {
            const data = {executorsNumber: '-1'};

            testWrapper.testErrors(done, data, 'invalid', []);
        });

        it('test errors message displayed for no number entered', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to next page: ${expectedNextUrlForExecNames}`, (done) => {
            const data = {executorsNumber: 2};
            testWrapper.testRedirect(done, data, expectedNextUrlForExecNames);
        });

        it(`test it redirects to next page when there is only one executor: ${expectedNextUrlForDeceasedName}`, (done) => {
            const data = {executorsNumber: 1};
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedName);
        });

        it('test it displays the errors when there are more than 20 executors', (done) => {
            const data = {executorsNumber: 21};

            testWrapper.testErrors(done, data, 'invalid', []);
        });
    });
});
