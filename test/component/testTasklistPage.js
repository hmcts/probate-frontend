const TestWrapper = require('test/util/TestWrapper'),
    sessionData = require('test/data/complete-form').formdata,
    singleApplicantData = require('test/data/singleApplicant');

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
                'checkYourAnswers',
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
                'checkYourAnswers',
                'alreadyDeclared',

            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test right content loaded in Review and Confirm section (Single Applicant)', (done) => {
            const singleApplicantSessionData = {
                will: sessionData.will,
                iht: sessionData.iht,
                applicant: sessionData.applicant,
                deceased: sessionData.deceased,
                executors: singleApplicantData.executors,
                declaration: sessionData.declaration
            };
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
                'checkYourAnswers',
                'alreadyDeclared',
            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(singleApplicantSessionData)
                .end(() => {
                    testWrapper.testContent(done, excludeKeys);
                });
        });
    });
});
