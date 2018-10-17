'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CopiesUk = require('app/steps/ui/copies/uk/index');

describe('copies-start', () => {
    let testWrapper;
    const expectedNextUrlForCopiesUk = CopiesUk.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CopiesStart');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it(`test it redirects to next page: ${expectedNextUrlForCopiesUk}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForCopiesUk);
        });

    });
});
