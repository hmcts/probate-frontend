'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CoApplicantAdoptionDeceasedPlace = require('app/steps/ui/executors/coapplicantadoptiondeceasedplace');
const CoApplicantAdoptedDeceasedOut = require('app/steps/ui/executors/coapplicantadopteddeceasedout');
const CoApplicantAdoptedDeceasedIn = require('app/steps/ui/executors/coapplicantadopteddeceasedin');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');

describe('coapplicant-adopted-deceased-in', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForCoApplicantAdoptionDeceasedPlace = CoApplicantAdoptionDeceasedPlace.getUrl(1);
    const expectedNextUrlForCoApplicantAdoptedDeceasedOut = CoApplicantAdoptedDeceasedOut.getUrl(1);

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantAdoptedDeceasedIn');
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
                    {fullName: 'Hello', lastName: 'ABC', coApplicantRelationshipToDeceased: 'optionParent', isApplicant: true},
                    {fullName: 'First coApplicant', coApplicantRelationshipToDeceased: 'optionParent', isApplicant: true},
                ]
            }
        };
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('CoApplicantAdoptionDeceasedPlace', null, null, [],
            false, {type: caseTypes.INTESTACY}, CoApplicantAdoptedDeceasedIn.getUrl(1));

        it('test content loaded on the page', (done) => {
            testWrapper.pageUrl = CoApplicantAdoptedDeceasedIn.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {deceasedName: 'John Doe', applicantName: 'First coApplicant'});
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.pageUrl = CoApplicantAdoptedDeceasedIn.getUrl(1);
            const data= {
                type: caseTypes.INTESTACY,
                applicantName: 'First coApplicant',
                list: [
                    {fullName: 'Hello', lastName: 'ABC', coApplicantRelationshipToDeceased: 'optionParent', isApplicant: true},
                    {fullName: 'First coApplicant', coApplicantRelationshipToDeceased: 'optionParent', isApplicant: true},
                ]
            };
            testWrapper.agent.post('/prepare-session/form').send(sessionData);
            testWrapper.testErrors(done, data, 'required');
        });

        it(`test it redirects to CoApplicant Adoption deceased place page if adopted in: /intestacy${expectedNextUrlForCoApplicantAdoptionDeceasedPlace}`, (done) => {
            testWrapper.pageUrl = CoApplicantAdoptedDeceasedIn.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        coApplicantAdoptedDeceasedIn: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForCoApplicantAdoptionDeceasedPlace}`);
                });
        });

        it(`test it redirects to CoApplicant Adoption deceased place page if child is adopted out: /intestacy${expectedNextUrlForCoApplicantAdoptedDeceasedOut}`, (done) => {
            testWrapper.pageUrl = CoApplicantAdoptedDeceasedIn.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        coApplicantAdoptedDeceasedIn: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForCoApplicantAdoptedDeceasedOut}`);
                });
        });
    });
});
