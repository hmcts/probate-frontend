'use strict';

const TestWrapper = require('test/util/TestWrapper');
const StartApply = require('app/steps/ui/startapply/index');
const StopPage = require('app/steps/ui/stoppage/index');
const json = require('app/resources/en/translation/iht/completed.json');

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

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to next page if iht completed: ${expectedNextUrlForStartApply}`, (done) => {
            const data = {
                'completed': json.optionYes
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStartApply);
        });

        it(`test it redirects to stop page if iht not completed: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                'completed': json.optionNo
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });

    });
});
