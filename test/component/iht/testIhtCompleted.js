'use strict';

const TestWrapper = require('test/util/TestWrapper');
const StartApply = require('app/steps/ui/startapply/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('iht-completed', () => {
    let testWrapper;
    const expectedNextUrlForStartApply = StartApply.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('ihtNotCompleted');

    beforeEach(() => {
        testWrapper = new TestWrapper('IhtCompleted');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        testHelpBlockContent.runTest('WillLeft');

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to Start Apply page: ${expectedNextUrlForStartApply}`, (done) => {
            const data = {
                'completed': 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStartApply);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                'completed': 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });

    });
});
