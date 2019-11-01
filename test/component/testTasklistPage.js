'use strict';

const TestWrapper = require('test/util/TestWrapper');
const caseTypes = require('app/utils/CaseTypes');

describe('task-list', () => {
    let testWrapper;
    let singleApplicantData;
    let sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('TaskList');

        singleApplicantData = require('test/data/singleApplicant');
        sessionData = require('test/data/complete-form').formdata;
    });

    afterEach(() => {
        delete require.cache[require.resolve('test/data/singleApplicant')];
        delete require.cache[require.resolve('test/data/complete-form')];
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('[PROBATE] test right content loaded on the page', (done) => {
            const contentToExclude = [
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
            sessionData.applicantEmail = 'test@email.com';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testDataPlayback(done, {}, contentToExclude);
                });
        });

        it('[INTESTACY] test right content loaded on the page', (done) => {
            const contentToExclude = [
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
            sessionData.applicantEmail = 'test@email.com';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testDataPlayback(done, {}, contentToExclude);
                });
        });

        it('[PROBATE] test right content loaded in Review and Confirm section (Multiple Applicants)', (done) => {
            const multipleApplicantSessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                caseType: caseTypes.GOP,
                will: sessionData.will,
                iht: sessionData.iht,
                applicant: sessionData.applicant,
                deceased: sessionData.deceased,
                executors: sessionData.executors,
                declaration: sessionData.declaration,
                applicantEmail: 'test@email.com'
            };
            const contentToExclude = [
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
                    testWrapper.testDataPlayback(done, {}, contentToExclude);
                });
        });

        it('[PROBATE] test right content loaded in Review and Confirm section (Single Applicant)', (done) => {
            const singleApplicantSessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                caseType: caseTypes.GOP,
                will: sessionData.will,
                iht: sessionData.iht,
                applicant: sessionData.applicant,
                deceased: sessionData.deceased,
                executors: singleApplicantData.executors,
                declaration: sessionData.declaration,
                applicantEmail: 'test@email.com'
            };
            const contentToExclude = [
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
                    testWrapper.testDataPlayback(done, {}, contentToExclude);
                });
        });

        it('[INTESTACY] test right content loaded in Review and Confirm section', (done) => {
            const singleApplicantSessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                caseType: caseTypes.INTESTACY,
                will: sessionData.will,
                iht: sessionData.iht,
                applicant: sessionData.applicant,
                deceased: sessionData.deceased,
                executors: singleApplicantData.executors,
                declaration: sessionData.declaration
            };
            const contentToExclude = [
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
                    testWrapper.testDataPlayback(done, {}, contentToExclude);
                });
        });
    });
});
