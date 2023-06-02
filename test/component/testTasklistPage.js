'use strict';

const TestWrapper = require('test/util/TestWrapper');
const caseTypes = require('app/utils/CaseTypes');
const config = require('config');
const nock = require('nock');

describe('task-list', () => {
    let testWrapper;
    let singleApplicantData;
    let sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('TaskList');

        singleApplicantData = require('test/data/singleApplicant');
        sessionData = require('test/data/complete-form').formdata;
    });

    afterEach(async () => {
        delete require.cache[require.resolve('test/data/singleApplicant')];
        delete require.cache[require.resolve('test/data/complete-form')];
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('[PROBATE] test right content loaded on the page when either declaration checkbox is false or single applicant', (done) => {
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
            delete sessionData.declaration.declarationCheckbox;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testDataPlayback(done, {}, contentToExclude);
                });
        });

        it('[PROBATE] test right content loaded on the page when declaration checkbox is true and has multiple applicants', (done) => {
            nock(config.services.orchestrator.url)
                .get(config.services.orchestrator.paths.forms.replace('{ccdCaseId}', sessionData.ccdCase.id) + '?probateType=PA')
                .reply(200, sessionData);

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

        it('[INTESTACY] test right content loaded on the page when no declaration statuses check needed', (done) => {
            nock(config.services.orchestrator.url)
                .get(config.services.orchestrator.paths.forms.replace('{ccdCaseId}', sessionData.ccdCase.id) + '?probateType=INTESTACY')
                .reply(200, sessionData);

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

        it('test redirect to citizens hub', (done) => {
            const singleApplicantSessionData = {
                ccdCase: {
                    state: 'CasePrinted',
                    id: 1234567890123456
                },
                payment: {
                    status: 'Success',
                    reference: '1234'
                }
            };
            singleApplicantSessionData.caseType = caseTypes.INTESTACY;

            testWrapper.agent.post('/prepare-session/form')
                .send(singleApplicantSessionData)
                .end(() => {
                    testWrapper.testRedirect(done, singleApplicantSessionData, '/citizens-hub');
                });
        });
    });
});
