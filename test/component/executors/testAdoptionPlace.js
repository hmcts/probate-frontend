'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CoApplicantParentAdoptedIn = require('app/steps/ui/executors/parentadoptedin');
const CoApplicantEmail = require('app/steps/ui/executors/coapplicantemail');
const CoApplicantAdoptionPlace = require('app/steps/ui/executors/adoptionplace');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');
const StopPage = require('../../../app/steps/ui/stoppage');

describe('coapplicant-adoption-place', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForCoApplicantCoApplicantParentAdoptedIn = CoApplicantParentAdoptedIn.getUrl(2);
    const expectedNextUrlForCoApplicantEmail = CoApplicantEmail.getUrl(1);
    const expectedNextUrlForStopPage = StopPage.getUrl('coApplicantAdoptionPlaceStop');

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantAdoptionPlace');
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
            false, {type: caseTypes.INTESTACY}, CoApplicantAdoptionPlace.getUrl(1));
        it('test content loaded on the page', (done) => {
            testWrapper.pageUrl = CoApplicantAdoptionPlace.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });
        it('test errors message displayed for missing data', (done) => {
            testWrapper.pageUrl = CoApplicantAdoptionPlace.getUrl(1);
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

        it(`test it redirects to any other children page if co-applicant is adopted in England or Wales: /intestacy${expectedNextUrlForCoApplicantEmail}`, (done) => {
            testWrapper.pageUrl = CoApplicantAdoptionPlace.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        adoptionPlace: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForCoApplicantEmail}`);
                });
        });

        it(`test it redirects to any other children page if co-applicant is adopted in England or Wales: /intestacy${expectedNextUrlForCoApplicantCoApplicantParentAdoptedIn}`, (done) => {
            testWrapper.pageUrl = CoApplicantAdoptionPlace.getUrl(2);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        adoptionPlace: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForCoApplicantCoApplicantParentAdoptedIn}`);
                });
        });
        it(`test it redirects to stop page if co-applicant is not adopted in England or Wales: /intestacy${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.pageUrl = CoApplicantAdoptionPlace.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        adoptionPlace: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForStopPage}`);
                });
        });
    });
});
