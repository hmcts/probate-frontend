const TestWrapper = require('test/util/TestWrapper'),
    TaskList = require('app/steps/ui/tasklist/index'),
    StopPage = require('app/steps/ui/stoppage/index');

describe('applicant-executor', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('notExecutor');

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantExecutor');
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

        it(`test it redirects to tasklist if applicant is an executor: ${expectedNextUrlForTaskList}`, (done) => {
            const data = {
                'executor': 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
        });

        it(`test it redirects to stop page if applicant is NOT an executor${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                'executor': 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });

    });
});
