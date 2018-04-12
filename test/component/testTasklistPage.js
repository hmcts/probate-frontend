const TestWrapper = require('test/util/TestWrapper');

describe('task-list', () => {
    let testWrapper, sessionData, singleApplicantData;

    beforeEach(() => {
        testWrapper = new TestWrapper('TaskList');
        sessionData = require('test/data/complete-form').formdata;
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

        it('test right content loaded in Review and Confirm section (Multiple Applicants)', (done) => {

            const excludeKeys = [
                'eligibilityTaskHeader',
                'eligibilityTaskList-item2',
                'eligibilityTaskList-item3',
                'executorsTaskChecklistHeader',
                'executorsTaskChecklist-item2',
                'executorsMultipleTaskChecklistHeader',
                'executorsMultipleTaskChecklist-item1',
                'executorsMultipleTaskChecklist-item2',
                'eligibilityTaskCompleteParagraph1',
                'executorsTaskCompleteParagraph1',
                'reviewAndConfirmTaskParagraph1',
                'reviewAndConfirmTaskCompleteParagraph',
                'copiesTaskParagraph1',
                'taskNotStarted',
                'taskStarted',
                'taskComplete',
                'taskUnavailable',
                'taskCompleteTag',
                'alreadyDeclared',

            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test right content loaded in Review and Confirm section (Single Applicant)', (done) => {
            singleApplicantData = require('test/data/singleApplicant');
            sessionData.executors = singleApplicantData.executors;
            const excludeKeys = [
                'eligibilityTaskHeader',
                'eligibilityTaskList-item2',
                'eligibilityTaskList-item3',
                'executorsTaskChecklistHeader',
                'executorsTaskChecklist-item2',
                'executorsMultipleTaskChecklistHeader',
                'executorsMultipleTaskChecklist-item1',
                'executorsMultipleTaskChecklist-item2',
                'eligibilityTaskCompleteParagraph1',
                'executorsTaskCompleteParagraph1',
                'reviewAndConfirmTaskParagraph1',
                'reviewAndConfirmTaskMultiplesParagraph1',
                'reviewAndConfirmTaskMultiplesParagraph2',
                'reviewAndConfirmTaskMultiplesParagraph3',
                'reviewAndConfirmTaskMultiplesParagraph4',
                'copiesTaskParagraph1',
                'taskNotStarted',
                'taskStarted',
                'taskComplete',
                'taskUnavailable',
                'taskCompleteTag',
                'alreadyDeclared',
            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, excludeKeys);
                });
        });
    });
});
