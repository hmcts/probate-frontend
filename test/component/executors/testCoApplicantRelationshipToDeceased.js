'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CoApplicantName = require('app/steps/ui/executors/coapplicantname');
const ParentDieBefore = require('app/steps/ui/executors/parentdiebefore');
const caseTypes = require('app/utils/CaseTypes');
const commonContent = require('../../../app/resources/en/translation/common.json');

describe('coapplicant-relationship-to-deceased', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForCoApplicantName = CoApplicantName.getUrl(1);

    const expectedNextUrlForParentDieBefore = ParentDieBefore.getUrl(1);

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantRelationshipToDeceased');
        sessionData = {
            type: caseTypes.INTESTACY,
            ccdCase: {
                state: 'Pending',
                id: 1234567890123456
            },
            deceased: {
                firstName: 'John',
                lastName: 'Doe',
                anyOtherChildren: 'optionYes',
                anyPredeceasedChildren: 'optionYesSome',
                anySurvivingGrandchildren: 'optionYes'
            },
            applicant: {
                'firstName': 'Bobby',
                'lastName': 'Applicant',
                'isApplying': true,
                'isApplicant': true,
                'fullName': 'Bobby Applicant'
            },
            executors: {
                list: [
                    {fullName: 'Main Applicant', isApplicant: true},
                    {fullName: 'First coApplicant', coApplicantRelationshipToDeceased: 'optionChild', isApplicant: true},
                ]
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

        it('test redirection to coApplicant name page when relationship to deceased is child', (done) => {
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
                        coApplicantRelationshipToDeceased: 'optionChild',
                        list: [
                            {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                        ]};

                    testWrapper.testRedirect(done, data, expectedNextUrlForCoApplicantName);
                });
        });

        it('test redirection to Parent die before page when relationship to deceased is Grandchild', (done) => {
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
                    const data = {list: [{'fullName': 'Jeff Exec Two', 'isApplying': true}],
                        coApplicantRelationshipToDeceased: 'optionGrandchild',};

                    testWrapper.testRedirect(done, data, expectedNextUrlForParentDieBefore);
                });
        });

        it('test redirection to stop page when relationship to deceased is others', (done) => {
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
                    const data = {list: [{'fullName': 'Jeff Exec One', 'isApplying': true}, {'fullName': 'Jeff Exec Two', 'isApplying': true, coapplicantRelationshipToDeceased: 'optionOther'}],
                        coApplicantRelationshipToDeceased: 'optionOther'};

                    testWrapper.testRedirect(done, data, '/intestacy/stop-page/otherCoApplicantRelationship');
                });
        });

        it('test correct content loaded on the page if relationship is grandchild', (done) => {
            sessionData.deceasedName = 'John Doe';
            sessionData.deceased.anyOtherChildren = 'optionYes';
            sessionData.anyPredeceasedChildren = 'optionYesAll';
            sessionData.anySurvivingGrandchildren = 'optionYes';
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            const contentToExclude = ['optionHalfBloodSibling', 'optionHalfBloodNieceOrNephew', 'optionHalfBloodNieceOrNephewHintText', 'optionWholeBloodSibling', 'optionWholeBloodNieceOrNephew', 'optionWholeBloodNieceOrNephewHintText'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        deceasedName: 'John Doe',
                        coApplicantRelationshipToDeceased: 'optionGrandchild'
                    };
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test correct content loaded on the page if relationship is half-niece or half-nephew', (done) => {
            sessionData.deceasedName = 'John Doe';
            sessionData.applicant.relationshipToDeceased = 'optionSibling';
            sessionData.applicant.sameParents = 'optionOneParentsSame';
            sessionData.applicant.anyOtherHalfSiblings = 'optionYes';
            sessionData.applicant.anyPredeceasedHalfSiblings = 'optionYesAll';
            sessionData.applicant.anySurvivingHalfNiecesAndHalfNephews = 'optionYes';
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            const contentToExclude = ['optionGrandchild', 'optionGrandchildHintText', 'optionWholeBloodSibling', 'optionWholeBloodNieceOrNephew', 'optionWholeBloodNieceOrNephewHintText'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        deceasedName: 'John Doe',
                        coApplicantRelationshipToDeceased: 'optionHalfBloodNieceOrNephew',
                    };
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test correct content loaded on the page if relationship is whole-niece or whole-nephew', (done) => {
            sessionData.deceasedName = 'John Doe';
            sessionData.applicant.relationshipToDeceased = 'optionSibling';
            sessionData.applicant.sameParents = 'optionBothParentsSame';
            sessionData.applicant.anyOtherWholeSiblings = 'optionYes';
            sessionData.applicant.anyPredeceasedWholeSiblings = 'optionYesSome';
            sessionData.applicant.anySurvivingWholeNiecesAndWholeNephews = 'optionYes';
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            const contentToExclude = ['optionGrandchild', 'optionGrandchildHintText', 'optionHalfBloodSibling', 'optionHalfBloodNieceOrNephew', 'optionHalfBloodNieceOrNephewHintText'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        deceasedName: 'John Doe',
                        coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew',
                    };
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test errors message displayed for required data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        deceasedName: 'John Doe',
                    };
                    testWrapper.testErrors(done, data, 'required');
                });
        });
    });
});
