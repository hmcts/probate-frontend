'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('executors-invites-sent', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsInvitesSent');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('ExecutorsInvitesSent');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it(`test it redirects to next page: ${expectedNextUrlForTaskList}`, (done) => {
            const data = {};
            testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
        });
    });
});
