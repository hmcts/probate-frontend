'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorsApplying = require('app/steps/ui/executors/applying/index');
const ExecutorsWhoDied = require('app/steps/ui/executors/whodied/index');

describe('executors-all-alive', () => {
    let testWrapper;
    const expectedNextUrlForExecsApplying = ExecutorsApplying.getUrl(1);
    const expectedNextUrlForExecsWhoDied = ExecutorsWhoDied.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsAllAlive');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {
            };

            testWrapper.testErrors(done, data, 'required');
        });

        it(`test it redirects to executors applying: ${expectedNextUrlForExecsApplying}`, (done) => {
            const data = {
                'allalive': 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForExecsApplying);
        });

        it(`test it redirects to which executors died: ${expectedNextUrlForExecsWhoDied}`, (done) => {
            const data = {
                'allalive': 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForExecsWhoDied);
        });

    });
});
