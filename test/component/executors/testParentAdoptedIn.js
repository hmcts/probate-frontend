'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ParentAdoptionPlace = require('app/steps/ui/executors/parentadoptionplace');
const ParentAdoptedOut = require('app/steps/ui/executors/parentadoptedout');
const ParentAdoptedIn = require('app/steps/ui/executors/parentadoptedin');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');

describe('parent-adopted-in', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForParentAdoptionPlace = ParentAdoptionPlace.getUrl(1);
    const expectedNextUrlForParentAdoptedOut = ParentAdoptedOut.getUrl(1);

    beforeEach(() => {
        testWrapper = new TestWrapper('ParentAdoptedIn');
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
            false, {caseType: caseTypes.INTESTACY}, ParentAdoptedIn.getUrl(1));
        it('test content loaded on the page', (done) => {
            testWrapper.pageUrl = ParentAdoptedIn.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {deceasedName: 'John Doe', applicantName: 'First coApplicant'});
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.pageUrl = ParentAdoptedIn.getUrl(1);
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

        it(`test it redirects to CoApplicant Adoption place page if child is adopted in: ${expectedNextUrlForParentAdoptionPlace}`, (done) => {
            testWrapper.pageUrl = ParentAdoptedIn.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        applicantParentAdoptedIn: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForParentAdoptionPlace);
                });
        });

        it(`test it redirects to CoApplicant Adoption place page if child is adopted out: ${expectedNextUrlForParentAdoptedOut}`, (done) => {
            testWrapper.pageUrl = ParentAdoptedIn.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        applicantParentAdoptedIn: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForParentAdoptedOut);
                });
        });
    });
});
