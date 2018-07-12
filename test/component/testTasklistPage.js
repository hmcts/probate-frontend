const TestWrapper = require('test/util/TestWrapper');
const sessionData = require('test/data/complete-form').formdata;
const singleApplicantData = require('test/data/singleApplicant');

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
                'introduction',
                'saveAndReturn',
                'reviewAndConfirmTaskMultiplesParagraph1',
                'reviewAndConfirmTaskMultiplesParagraph2',
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
            const singleApplicantSessionData = {
                will: sessionData.will,
                iht: sessionData.iht,
                applicant: sessionData.applicant,
                deceased: sessionData.deceased,
                executors: singleApplicantData.executors,
                declaration: sessionData.declaration
            };
            const excludeKeys = [
                'reviewAndConfirmTaskMultiplesParagraph1',
                'reviewAndConfirmTaskMultiplesParagraph2',
                'taskNotStarted',
                'taskStarted',
                'taskComplete',
                'taskUnavailable',
                'taskCompleteTag',
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
