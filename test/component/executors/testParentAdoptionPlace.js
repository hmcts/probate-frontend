'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CoApplicantEmail = require('app/steps/ui/executors/coapplicantemail');
const ParentAdoptionPlace = require('app/steps/ui/executors/parentadoptionplace');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');
const StopPage = require('../../../app/steps/ui/stoppage');

describe('parent-adoption-place', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForCoApplicantEmail = CoApplicantEmail.getUrl(2);
    const expectedNextUrlForStopPage = StopPage.getUrl('coApplicantAdoptionPlaceStop');

    beforeEach(() => {
        testWrapper = new TestWrapper('ParentAdoptionPlace');
        sessionData = {
            caseType: caseTypes.INTESTACY,
            applicantName: 'First coApplicant',
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
                list: [
                    {fullName: 'Main Applicant', isApplicant: true},
                    {fullName: 'First coApplicant', coApplicantRelationshipToDeceased: 'optionChild', isApplicant: true},
                    {fullName: 'Second coApplicant', coApplicantRelationshipToDeceased: 'optionGrandchild', isApplicant: true}
                ]
            }
        };
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('CoApplicantAdoptionPlace', null, null, [],
            false, {type: caseTypes.INTESTACY}, ParentAdoptionPlace.getUrl(1));
        it('test content loaded on the page', (done) => {
            testWrapper.pageUrl = ParentAdoptionPlace.getUrl(2);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });
        it('test errors message displayed for missing data', (done) => {
            testWrapper.pageUrl = ParentAdoptionPlace.getUrl(2);
            const data= {
                type: caseTypes.INTESTACY,
                applicantName: 'First coApplicant',
                list: [
                    {fullName: 'Hello', lastName: 'ABC', coApplicantRelationshipToDeceased: 'optionChild', isApplicant: true},
                    {fullName: 'First coApplicant', coApplicantRelationshipToDeceased: 'optionChild', isApplicant: true},
                    {fullName: 'Second coApplicant', coApplicantRelationshipToDeceased: 'optionGrandchild', isApplicant: true}
                ]
            };
            testWrapper.agent.post('/prepare-session/form').send(sessionData);
            testWrapper.testErrors(done, data, 'required');
        });

        it(`test it redirects to any other children page if co-applicant's parent is adopted in England or Wales: ${expectedNextUrlForCoApplicantEmail}`, (done) => {
            testWrapper.pageUrl = ParentAdoptionPlace.getUrl(2);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        applicantParentAdoptionPlace: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForCoApplicantEmail);
                });
        });
        it(`test it redirects to stop page if co-applicant is not adopted in England or Wales: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.pageUrl = ParentAdoptionPlace.getUrl(2);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        applicantParentAdoptionPlace: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
