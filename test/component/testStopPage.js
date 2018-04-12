const TestWrapper = require('test/util/TestWrapper'),
      config = require('app/config');

describe('stop-page', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('StopPage');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('noWill');

            const excludeKeys = ['notOriginal', 'codicils', 'notExecutor', 'executorApplying', 'ihtNotCompleted'];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test right content loaded on the page', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notOriginal');

            const excludeKeys = ['noWill', 'codicils', 'notExecutor', 'executorApplying', 'ihtNotCompleted'];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test right content loaded on the page', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('codicils');

            const excludeKeys = ['noWill', 'notOriginal', 'notExecutor', 'executorApplying', 'ihtNotCompleted'];

            testWrapper.testContent(done, excludeKeys);
        });


        it('test right content loaded on the page', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notExecutor');

            const excludeKeys = ['noWill', 'notOriginal', 'codicils', 'executorApplying', 'ihtNotCompleted'];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test right content loaded on the page - executor applying', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('executorApplying');

            const excludeKeys = ['noWill', 'notOriginal', 'codicils', 'notExecutor', 'ihtNotCompleted'];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test right content loaded on the page - iht not completed', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('ihtNotCompleted');

            const excludeKeys = ['noWill', 'notOriginal', 'codicils', 'executorApplying', 'notExecutor'];

            testWrapper.testContent(done, excludeKeys, {ihtNotCompleted: config.links.ihtNotCompleted});
        });
    });
});
