'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist/index');
const ExecutorsNames = require('app/steps/ui/executors/names/index');

describe('executors-number', () => {
    let testWrapper;
    const expectedNextUrlForExecNames = ExecutorsNames.getUrl();
    const expectedNextUrlForTaskList = TaskList.getUrl();

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

        it('test it displays the errors when there are more than 20 executors', (done) => {
            const data = {executorsNumber: 21};

            testWrapper.testErrors(done, data, 'invalid', []);
        });

        it(`test it redirects to next page: ${expectedNextUrlForExecNames}`, (done) => {
            const data = {executorsNumber: 2};
            testWrapper.testRedirect(done, data, expectedNextUrlForExecNames);
        });

        it(`test it redirects to tasklist when there is only one executor: ${expectedNextUrlForTaskList}`, (done) => {
            const data = {executorsNumber: 1};
            testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
        });
    });
});
