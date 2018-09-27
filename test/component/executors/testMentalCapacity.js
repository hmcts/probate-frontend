'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtCompleted = require('app/steps/ui/iht/completed/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('mental-capacity', () => {
    let testWrapper;
    const expectedNextUrlForIhtCompleted = IhtCompleted.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('mentalCapacity');

    beforeEach(() => {
        testWrapper = new TestWrapper('MentalCapacity');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        testHelpBlockContent.runTest('WillLeft');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, [], {});
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};
            testWrapper.testErrors(done, data, 'required');
        });

        it(`test it redirects to IHT Completed if all executors are mentally capable: ${expectedNextUrlForIhtCompleted}`, (done) => {
            const data = {
                'mentalCapacity': 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtCompleted);
        });

        it(`test it redirects to stop page if not all executors are mentally capable: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                'mentalCapacity': 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });
    });
});
