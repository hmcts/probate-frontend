'use strict';

const {expect} = require('chai');
const TestWrapper = require('test/util/TestWrapper');
const CoApplicantEmail = require('app/steps/ui/executors/coapplicantemail');
const CoApplicantName = require('app/steps/ui/executors/coapplicantname');
const ParentAdoptionPlace = require('app/steps/ui/executors/parentadoptionplace');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');
const StopPage = require('../../../app/steps/ui/stoppage');

describe('parent-adoption-place', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForCoApplicantEmail = CoApplicantEmail.getUrl(2);
    const expectedNextUrlForCoApplicantName = CoApplicantName.getUrl(1);
    const expectedNextUrlForStopPage = StopPage.getUrl('coApplicantAdoptionPlaceStop');
    const expectedNextUrlForNoNameStopPage = StopPage.getUrl('coApplicantParentAdoptionPlaceNoNameStop');

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantParentAdoptionPlace');
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

        it(`test it redirects to any other children page if co-applicant's parent is adopted in England or Wales: /intestacy${expectedNextUrlForCoApplicantEmail}`, (done) => {
            testWrapper.pageUrl = ParentAdoptionPlace.getUrl(2);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        applicantParentAdoptionPlace: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForCoApplicantEmail}`);
                });
        });
        it(`test it redirects to stop page if co-applicant is not adopted in England or Wales: /intestacy${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.pageUrl = ParentAdoptionPlace.getUrl(2);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        applicantParentAdoptionPlace: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForStopPage}`);
                });
        });

        it('shows required validation for whole-blood sibling path when no option selected', (done) => {
            testWrapper.pageUrl = ParentAdoptionPlace.getUrl(1);
            sessionData.executors = {
                list: [
                    {fullName: 'Main Applicant', isApplicant: true},
                    {fullName: 'First coApplicant', coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew', isApplicant: true}
                ]
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.post(testWrapper.pageUrl)
                        .type('form')
                        .send({applicantParentAdoptionPlace: ''})
                        .expect(200)
                        .then(response => {
                            const expectedError = 'Select &lsquo;Yes&rsquo; if the adoption took place in England or Wales';
                            expect(response.text).to.contain('There is a problem');
                            expect(response.text).to.contain(expectedError);
                            expect(response.text).to.contain('href="#applicantParentAdoptionPlace"');
                            expect(response.text).to.contain('applicantParentAdoptionPlace-error');
                            done();
                        })
                        .catch(done);
                });
        });

        it(`redirects whole-blood yes to co-applicant name: /intestacy${expectedNextUrlForCoApplicantName}`, (done) => {
            testWrapper.pageUrl = ParentAdoptionPlace.getUrl(1);
            sessionData.executors = {
                list: [
                    {fullName: 'Main Applicant', isApplicant: true},
                    {fullName: 'First coApplicant', coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew', isApplicant: true}
                ]
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, {applicantParentAdoptionPlace: 'optionYes'}, `/intestacy${expectedNextUrlForCoApplicantName}`);
                });
        });

        it(`redirects whole-blood no to no-name stop page: /intestacy${expectedNextUrlForNoNameStopPage}`, (done) => {
            testWrapper.pageUrl = ParentAdoptionPlace.getUrl(1);
            sessionData.executors = {
                list: [
                    {fullName: 'Main Applicant', isApplicant: true},
                    {fullName: 'First coApplicant', coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew', isApplicant: true}
                ]
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, {applicantParentAdoptionPlace: 'optionNo'}, `/intestacy${expectedNextUrlForNoNameStopPage}`);
                });
        });
    });
});
