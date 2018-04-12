const TestWrapper = require('test/util/TestWrapper');

describe('task-list', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('TaskList');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {

            const excludeKeys = [
                'eligibilityTaskCompleteParagraph1',
                'executorsTaskCompleteParagraph1',
                'reviewAndConfirmTaskCompleteParagraph',
                'reviewAndConfirmTaskMultiplesParagraph1',
                'reviewAndConfirmTaskMultiplesParagraph2',
                'reviewAndConfirmTaskMultiplesParagraph3',
                'reviewAndConfirmTaskMultiplesParagraph4',
                'taskNotStarted',
                'taskStarted',
                'taskComplete',
                'taskUnavailable',
                'taskCompleteTag',
                'alreadyDeclared',

            ];

            testWrapper.testContent(done, excludeKeys);
        });
    });
});
