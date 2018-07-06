const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist/index');

describe('start-page', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('StartPage');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it(`test it redirects to next page: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForTaskList);
        });

    });
});
