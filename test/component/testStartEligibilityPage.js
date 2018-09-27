'use strict';

const TestWrapper = require('test/util/TestWrapper');
const WillLeft = require('app/steps/ui/will/left/index');

describe('startEligibility', () => {
    let testWrapper;
    const expectedNextUrlForWillLeft = WillLeft.getUrl();

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

        it(`test it redirects to next page: ${expectedNextUrlForWillLeft}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForWillLeft);
        });

    });
});
