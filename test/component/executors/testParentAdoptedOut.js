'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ParentAdoptedOut = require('app/steps/ui/executors/parentadoptedout');
const CoApplicantEmail = require('app/steps/ui/executors/coapplicantemail');
const StopPage = require('../../../app/steps/ui/stoppage');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');

describe('parent-adopted-out', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForCoApplicantEmail = CoApplicantEmail.getUrl(1);
    const expectedNextUrlForStopPage = StopPage.getUrl('coApplicantParentAdoptedOutStop');

    beforeEach(() => {
        testWrapper = new TestWrapper('ParentAdoptedOut');
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
        testCommonContent.runTest('CoApplicantAdoptedOut', null, null, [],
            false, {caseType: caseTypes.INTESTACY}, ParentAdoptedOut.getUrl(1));

        it('test content loaded on the page', (done) => {
            testWrapper.pageUrl = ParentAdoptedOut.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {deceasedName: 'John Doe', applicantName: 'First coApplicant'});
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.pageUrl = ParentAdoptedOut.getUrl(1);
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

        it(`test it redirects to CoApplicant Adoption place page if child is adopted out: ${expectedNextUrlForCoApplicantEmail}`, (done) => {
            testWrapper.pageUrl = ParentAdoptedOut.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        applicantParentAdoptedOut: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForCoApplicantEmail);
                });
        });
        it(`test it redirects to stop page if co-applicant is adopted out : ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.pageUrl = ParentAdoptedOut.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        applicantParentAdoptedOut: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
