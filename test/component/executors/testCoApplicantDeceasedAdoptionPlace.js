'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CoApplicantEmail = require('app/steps/ui/executors/coapplicantemail');
const CoApplicantAdoptionDeceasedPlace = require('app/steps/ui/executors/coapplicantadoptiondeceasedplace');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');
const StopPage = require('../../../app/steps/ui/stoppage');

describe('coapplicant-adoption-deceased-place', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForCoApplicantEmail = CoApplicantEmail.getUrl(1);
    const expectedNextUrlForStopPage = StopPage.getUrl('coApplicantAdoptionDeceasedPlaceStop');

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantAdoptionDeceasedPlace');
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
                    {fullName: 'First coApplicant', coApplicantRelationshipToDeceased: 'optionParent', isApplicant: true}
                ]
            }
        };
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('CoApplicantAdoptionDeceasedPlace', null, null, [],
            false, {type: caseTypes.INTESTACY}, CoApplicantAdoptionDeceasedPlace.getUrl(1));

        it('test content loaded on the page', (done) => {
            testWrapper.pageUrl = CoApplicantAdoptionDeceasedPlace.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.pageUrl = CoApplicantAdoptionDeceasedPlace.getUrl(1);
            const data= {
                type: caseTypes.INTESTACY,
                applicantName: 'First coApplicant',
                list: [
                    {fullName: 'Hello', lastName: 'ABC', coApplicantRelationshipToDeceased: 'optionParent', isApplicant: true}
                ]
            };
            testWrapper.agent.post('/prepare-session/form').send(sessionData);
            testWrapper.testErrors(done, data, 'required');
        });

        it(`test it redirects to email page if co-applicant is adopted in England or Wales: /intestacy${expectedNextUrlForCoApplicantEmail}`, (done) => {
            testWrapper.pageUrl = CoApplicantAdoptionDeceasedPlace.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        coApplicantAdoptionDeceasedPlace: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForCoApplicantEmail}`);
                });
        });

        it(`test it redirects to stop page if co-applicant is not adopted in England or Wales: /intestacy${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.pageUrl = CoApplicantAdoptionDeceasedPlace.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        coApplicantAdoptionDeceasedPlace: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForStopPage}`);
                });
        });
    });
});
