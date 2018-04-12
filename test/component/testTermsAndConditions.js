const TestWrapper = require('test/util/TestWrapper');

describe('terms-conditions', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('TermsConditions');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });
    });
});
