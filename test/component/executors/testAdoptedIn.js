'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CoApplicantAdoptionPlace = require('app/steps/ui/executors/adoptionplace');
const CoApplicantAdoptedOut = require('app/steps/ui/executors/adoptedout');
const CoApplicantAdoptedIn = require('app/steps/ui/executors/adoptedin');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');

describe('coapplicant-adopted-in', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForCoApplicantAdoptionPlace = CoApplicantAdoptionPlace.getUrl(1);
    const expectedNextUrlForCoApplicantAdoptedOut = CoApplicantAdoptedOut.getUrl(1);

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantAdoptedIn');
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
                    {fullName: 'Hello', lastName: 'ABC', coApplicantRelationshipToDeceased: 'optionChild', isApplicant: true},
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
            false, {type: caseTypes.INTESTACY}, CoApplicantAdoptedIn.getUrl(1));
        it('test content loaded on the page', (done) => {
            testWrapper.pageUrl = CoApplicantAdoptedIn.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {deceasedName: 'John Doe', applicantName: 'First coApplicant'});
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.pageUrl = CoApplicantAdoptedIn.getUrl(1);
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

        it(`test it redirects to CoApplicant Adoption place page if child is adopted in: ${expectedNextUrlForCoApplicantAdoptionPlace}`, (done) => {
            testWrapper.pageUrl = CoApplicantAdoptedIn.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        adoptedIn: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForCoApplicantAdoptionPlace);
                });
        });

        it(`test it redirects to CoApplicant Adoption place page if child is adopted out: ${expectedNextUrlForCoApplicantAdoptedOut}`, (done) => {
            testWrapper.pageUrl = CoApplicantAdoptedIn.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        adoptedIn: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForCoApplicantAdoptedOut);
                });
        });
    });
});
