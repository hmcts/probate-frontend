'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CopiesUk = require('app/steps/ui/copies/uk');

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

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [
                'paragraph2_1'
            ];
            testWrapper.testContent(done, excludeKeys);
        });

        it(`test it redirects to next page: ${expectedNextUrlForCopiesUk}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForCopiesUk);
        });

    });
});
