'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CoApplicantName = require('app/steps/ui/executors/coapplicantname');
const caseTypes = require('app/utils/CaseTypes');
const commonContent = require('../../../app/resources/en/translation/common.json');

describe('Co-applicant-parent-die-before', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForCoApplicantName = CoApplicantName.getUrl(1);

    beforeEach(() => {
        testWrapper = new TestWrapper('ParentDieBefore');
        sessionData = {
            type: caseTypes.INTESTACY,
            ccdCase: {
                state: 'Pending',
                id: 1234567890123456
            },
            deceased: {
                firstName: 'John',
                lastName: 'Doe'
            },
            applicant: {
                'firstName': 'Bobby',
                'lastName': 'Applicant',
                'isApplying': true,
                'isApplicant': true,
                'fullName': 'Bobby Applicant'
            },
            executors: {
                list: [{fullName: 'Bobby Applicant', isApplying: true, isApplicant: true},
                    {coApplicantRelationshipToDeceased: 'optionChild', isApplying: true}]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test help block content is loaded on page', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
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

        it('test redirection to CoApplicant name page when co applicant parent has died before is provided', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        applicantParentDieBeforeDeceased: 'optionYes',
                        list: [
                            {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                            {coApplicantRelationshipToDeceased: 'optionGrandchild', isApplying: true}
                        ]};

                    testWrapper.testRedirect(done, data, expectedNextUrlForCoApplicantName);
                });
        });

        it('test redirection to stop page when co applicant parent has not died before is provided', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        applicantParentDieBeforeDeceased: 'optionNo',
                        list: [
                            {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                            {coApplicantRelationshipToDeceased: 'optionGrandchild', isApplying: true}
                        ]};

                    testWrapper.testRedirect(done, data, '/stop-page/otherCoApplicantRelationship');
                });
        });

        it('test correct content loaded on the page', (done) => {
            sessionData.deceased = {
                firstName: 'John',
                lastName: 'Doe'
            };
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        deceasedName: 'John Doe'
                    };
                    testWrapper.testContent(done, contentData);
                });
        });

        it('test errors message displayed for required data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 1,
                        deceasedName: 'John Doe',
                        applicantParentDieBeforeDeceased: ''
                    };
                    const errorsToTest = ['applicantParentDieBeforeDeceased'];
                    testWrapper.testErrors(done, data, 'required', errorsToTest);
                });
        });
    });
});
