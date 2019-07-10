'use strict';

const TestWrapper = require('test/util/TestWrapper');
const singleApplicantData = require('test/data/singleApplicant');
const caseTypes = require('app/utils/CaseTypes');

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
        it('[PROBATE] test right content loaded on the page', (done) => {
            const excludeKeys = [
                'applicantsTask',
                'copiesTaskIntestacy',
                'introduction',
                'saveAndReturn',
                'reviewAndConfirmTaskMultiplesParagraph1',
                'reviewAndConfirmTaskMultiplesParagraph2',
                'taskNotStarted',
                'taskStarted',
                'taskComplete',
                'taskUnavailable',
                'checkYourAnswers',
                'alreadyDeclared'
            ];
            sessionData.caseType = caseTypes.GOP;
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('[INTESTACY] test right content loaded on the page', (done) => {
            const excludeKeys = [
                'executorsTask',
                'copiesTaskProbate',
                'documentTask',
                'introduction',
                'saveAndReturn',
                'reviewAndConfirmTaskMultiplesParagraph1',
                'reviewAndConfirmTaskMultiplesParagraph2',
                'taskNotStarted',
                'taskStarted',
                'taskComplete',
                'taskUnavailable',
                'checkYourAnswers',
                'alreadyDeclared'
            ];
            sessionData.caseType = caseTypes.INTESTACY;
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('[PROBATE] test right content loaded in Review and Confirm section (Multiple Applicants)', (done) => {
            const multipleApplicantSessionData = {
                caseType: caseTypes.GOP,
                will: sessionData.will,
                iht: sessionData.iht,
                applicant: sessionData.applicant,
                deceased: sessionData.deceased,
                executors: sessionData.executors,
                declaration: sessionData.declaration
            };
            const excludeKeys = [
                'applicantsTask',
                'copiesTaskIntestacy',
                'taskNotStarted',
                'taskStarted',
                'taskComplete',
                'taskUnavailable',
                'checkYourAnswers',
                'alreadyDeclared'
            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(multipleApplicantSessionData)
                .end(() => {
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('[PROBATE] test right content loaded in Review and Confirm section (Single Applicant)', (done) => {
            const singleApplicantSessionData = {
                caseType: caseTypes.GOP,
                will: sessionData.will,
                iht: sessionData.iht,
                applicant: sessionData.applicant,
                deceased: sessionData.deceased,
                executors: singleApplicantData.executors,
                declaration: sessionData.declaration
            };
            const excludeKeys = [
                'applicantsTask',
                'copiesTaskIntestacy',
                'reviewAndConfirmTaskMultiplesParagraph1',
                'reviewAndConfirmTaskMultiplesParagraph2',
                'taskNotStarted',
                'taskStarted',
                'taskComplete',
                'taskUnavailable',
                'checkYourAnswers',
                'alreadyDeclared'
            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(singleApplicantSessionData)
                .end(() => {
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('[INTESTACY] test right content loaded in Review and Confirm section', (done) => {
            const singleApplicantSessionData = {
                caseType: caseTypes.INTESTACY,
                will: sessionData.will,
                iht: sessionData.iht,
                applicant: sessionData.applicant,
                deceased: sessionData.deceased,
                executors: singleApplicantData.executors,
                declaration: sessionData.declaration
            };
            const excludeKeys = [
                'executorsTask',
                'copiesTaskProbate',
                'documentTask',
                'reviewAndConfirmTaskMultiplesParagraph1',
                'reviewAndConfirmTaskMultiplesParagraph2',
                'taskNotStarted',
                'taskStarted',
                'taskComplete',
                'taskUnavailable',
                'checkYourAnswers',
                'alreadyDeclared'
            ];

            singleApplicantSessionData.caseType = caseTypes.INTESTACY;
            testWrapper.agent.post('/prepare-session/form')
                .send(singleApplicantSessionData)
                .end(() => {
                    testWrapper.testContent(done, excludeKeys);
                });
        });
    });
});
