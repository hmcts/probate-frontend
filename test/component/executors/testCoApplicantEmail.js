'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CoApplicantEmail = require('app/steps/ui/executors/coapplicantemail');
const commonContent = require('app/resources/en/translation/common');
const caseTypes = require('app/utils/CaseTypes');

describe('coapplicant-email', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantEmail');
        sessionData = {
            type: caseTypes.GOP,
            ccdCase: {
                state: 'Pending',
                id: 1234567890123456
            },
            applicant: {
                firstName: 'John',
                lastName: 'TheApplicant'
            },
            executors: {
                executorsNumber: 3,
                list: [
                    {fullName: 'John', isApplying: true, isApplicant: true},
                    {fullName: 'Other Applicant', isApplying: true, coApplicantRelationshipToDeceased: 'optionChild', childAdoptedIn: 'optionYes'},
                    {fullName: 'Harvey', coApplicantRelationshipToDeceased: 'optionChild', childAdoptedIn: 'optionYes'}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test help block content is loaded on page', (done) => {
            testWrapper.pageUrl = CoApplicantEmail.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const playbackData = {
                        helpTitle: commonContent.helpTitle,
                        helpHeading1: commonContent.helpHeading1,
                        helpHeading2: commonContent.helpHeading2,
                        helpHeading3: commonContent.helpHeading3,
                        helpTelephoneNumber: commonContent.helpTelephoneNumber,
                        helpTelephoneOpeningHoursTitle: commonContent.helpTelephoneOpeningHoursTitle,
                        helpTelephoneOpeningHours1: commonContent.helpTelephoneOpeningHours1,
                        helpTelephoneOpeningHours2: commonContent.helpTelephoneOpeningHours2,
                        helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, commonContent.helpEmail)
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test correct content is loaded on the page', (done) => {
            testWrapper.pageUrl = CoApplicantEmail.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        executorName: 'Other Applicant'
                    };

                    testWrapper.testContent(done, contentData);
                });
        });

        it('test error messages displayed if no data entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const errorsToTest = ['email'];
                    const data = {
                        index: 1,
                        email: '',
                        executorName: 'Other Applicant'
                    };

                    testWrapper.testErrors(done, data, 'required', errorsToTest);
                });
        });

        it('test error messages displayed if no email entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 1,
                        executorName: 'Other Applicant',
                        email: '',
                    };
                    const errorsToTest = ['email'];

                    testWrapper.testErrors(done, data, 'required', errorsToTest);
                });
        });

        it('test error messages displayed if invalid email entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 1,
                        executorName: 'Other Applicant',
                        email: 'test@.com',
                    };
                    const errorsToTest = ['email'];

                    testWrapper.testErrors(done, data, 'invalid', errorsToTest);
                });
        });

        it('test error messages displayed if invalid data entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 1,
                        executorName: 'Other Applicant',
                        email: 'b@.m',
                    };

                    testWrapper.testErrors(done, data, 'invalid');
                });
        });
    });
});
