'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('mental-capacity', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('mentalCapacity');

    beforeEach(() => {
        testWrapper = new TestWrapper('MentalCapacity');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('MentalCapacity');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, [], {});
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};
            testWrapper.testErrors(done, data, 'required');
        });

        it(`test it redirects to tasklist if all executors are mentally capable: ${expectedNextUrlForTaskList}`, (done) => {
            const data = {
                mentalCapacity: 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
        });

        it(`test it redirects to stop page if not all executors are mentally capable: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                mentalCapacity: 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });
    });
});
