'use strict';

const TestWrapper = require('test/util/TestWrapper');
const StartApply = require('app/steps/ui/startapply/index');

describe('start-eligibility', () => {
    let testWrapper;
    const expectedNextUrlForStartApply = StartApply.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('StartEligibility');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it(`test it redirects to next page: ${expectedNextUrlForStartApply}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForStartApply);
        });

    });
});
