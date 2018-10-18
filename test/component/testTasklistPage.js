'use strict';

const TestWrapper = require('test/util/TestWrapper');
const singleApplicantData = require('test/data/singleApplicant');

describe('task-list', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('TaskList');

        sessionData = require('test/data/complete-form').formdata;
    });

    afterEach(() => {
        delete require.cache[require.resolve('test/data/complete-form')];
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page (feature toggle off)', (done) => {
            const excludeKeys = [
                'introduction',
                'saveAndReturn',
                'reviewAndConfirmTaskMultiplesParagraph1',
                'reviewAndConfirmTaskMultiplesParagraph2',
                'taskNotStarted',
                'taskStarted',
                'taskComplete',
                'taskUnavailable',
                'checkYourAnswers',
                'alreadyDeclared',
                'deceasedTask'
            ];

            sessionData.featureToggles = {
                screening_questions: false
            };

            testWrapper.agent.post('/prepare-session/featureToggles')
                .send(sessionData.featureToggles)
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, excludeKeys);
                        });
                });
        });

        it('test right content loaded in Review and Confirm section (Multiple Applicants) (feature toggle off)', (done) => {
            const multipleApplicantSessionData = {
                will: sessionData.will,
                iht: sessionData.iht,
                applicant: sessionData.applicant,
                deceased: sessionData.deceased,
                executors: sessionData.executors,
                declaration: sessionData.declaration
            };
            const excludeKeys = [
                'taskNotStarted',
                'taskStarted',
                'taskComplete',
                'taskUnavailable',
                'checkYourAnswers',
                'alreadyDeclared',
                'deceasedTask'
            ];

            sessionData.featureToggles = {
                screening_questions: false
            };

            testWrapper.agent.post('/prepare-session/featureToggles')
                .send(sessionData.featureToggles)
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(multipleApplicantSessionData)
                        .end(() => {
                            testWrapper.testContent(done, excludeKeys);
                        });
                });
        });

        it('test right content loaded in Review and Confirm section (Single Applicant) (feature toggle off)', (done) => {
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
                'checkYourAnswers',
                'alreadyDeclared',
                'deceasedTask'
            ];

            sessionData.featureToggles = {
                screening_questions: false
            };

            testWrapper.agent.post('/prepare-session/featureToggles')
                .send(sessionData.featureToggles)
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(singleApplicantSessionData)
                        .end(() => {
                            testWrapper.testContent(done, excludeKeys);
                        });
                });
        });
    });
});
