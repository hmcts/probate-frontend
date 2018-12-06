'use strict';

const TestWrapper = require('test/util/TestWrapper');
const WillOriginal = require('app/steps/ui/will/original/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('will-left', () => {
    let testWrapper;
    const expectedNextUrlForWillOriginal = WillOriginal.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('noWill');

    beforeEach(() => {
        testWrapper = new TestWrapper('WillLeft');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('WillLeft');

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to will original: ${expectedNextUrlForWillOriginal}`, (done) => {
            const data = {
                left: 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForWillOriginal);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                left: 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });
    });
});
