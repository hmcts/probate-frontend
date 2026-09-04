'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CoApplicantAdoptedDeceasedOut = require('app/steps/ui/executors/coapplicantadopteddeceasedout');
const CoApplicantEmail = require('app/steps/ui/executors/coapplicantemail');
const StopPage = require('../../../app/steps/ui/stoppage');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');

describe('coapplicant-adopted-deceased-out', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForCoApplicantEmail = CoApplicantEmail.getUrl(1);
    const expectedNextUrlForStopPage = StopPage.getUrl('coApplicantAdoptedDeceasedOutStop');

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantAdoptedDeceasedOut');
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
        testCommonContent.runTest('CoApplicantAdoptedDeceasedOut', null, null, [],
            false, {caseType: caseTypes.INTESTACY}, CoApplicantAdoptedDeceasedOut.getUrl(1));

        it('test content loaded on the page', (done) => {
            testWrapper.pageUrl = CoApplicantAdoptedDeceasedOut.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {deceasedName: 'John Doe', applicantName: 'First coApplicant'});
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.pageUrl = CoApplicantAdoptedDeceasedOut.getUrl(1);
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

        it(`test it redirects to Co Applicant email page if child is not adopted out: /intestacy${expectedNextUrlForCoApplicantEmail}`, (done) => {
            testWrapper.pageUrl = CoApplicantAdoptedDeceasedOut.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        coApplicantAdoptedDeceasedOut: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForCoApplicantEmail}`);
                });
        });

        it(`test it redirects to stop page if co-applicant is adopted out : /intestacy${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.pageUrl = CoApplicantAdoptedDeceasedOut.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        coApplicantAdoptedDeceasedOut: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForStopPage}`);
                });
        });
    });
});
