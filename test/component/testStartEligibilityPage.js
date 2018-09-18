'use strict';

const TestWrapper = require('test/util/TestWrapper');
const NewWillLeft = require('app/steps/ui/will/newleft/index');

describe('startEligibility', () => {
    let testWrapper;
    const expectedNextUrlForWillLeft = NewWillLeft.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('NewStartEligibility');
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
