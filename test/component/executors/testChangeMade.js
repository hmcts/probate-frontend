'use strict';

const TestWrapper = require('test/util/TestWrapper');
const Tasklist = require('app/steps/ui/tasklist/index');

describe('executors-change-made', () => {
    let testWrapper;
    const expectedNextUrlForChangeMade = Tasklist.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsChangeMade');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it(`test it redirects to next page: ${expectedNextUrlForChangeMade}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForChangeMade);
        });
    });
});
