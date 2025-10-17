'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CoApplicantEmail = require('app/steps/ui/executors/coapplicantemail');
const CoApplicantAdoptionPlace = require('app/steps/ui/executors/adoptionplace');
const StopPage = require('app/steps/ui/stoppage');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');

describe('coapplicant-adoption-place', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForCoApplicantEmail = CoApplicantEmail.getUrl(1);
    const expectedNextUrlForStopPage = StopPage.getUrl('coApplicantAdoptionPlaceStop');

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantAdoptionPlace');
        sessionData = {
            index: 0,
            type: caseTypes.INTESTACY,
            ccdCase: {
                state: 'Pending',
                id: 1234567890123456
            },
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
                    {},
                    {fullName: 'John', lastName: 'TheApplicant', coApplicantRelationshipToDeceased: 'optionChild', isApplicant: true},
                    {fullName: 'First coApplicant', coApplicantRelationshipToDeceased: 'optionGrandchild', isApplicant: true}
                ]
            }
        };
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('CoApplicantAdoptionPlace', null, null, [], false, {type: caseTypes.INTESTACY});
        it('test content loaded on the page', (done) => {
            testWrapper.pageUrl = CoApplicantAdoptionPlace.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {fullName: 'First coApplicant', deceasedName: 'John Doe'});
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to any other children page if child is adopted in England or Wales: ${expectedNextUrlForCoApplicantEmail}`, (done) => {
            //testWrapper.pageUrl = CoApplicantAdoptionPlace.getUrl(1);
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        adoptionPlace: 'optionYes',
                        list: [
                            {},
                            {fullName: 'John', lastName: 'TheApplicant', coApplicantRelationshipToDeceased: 'optionChild', isApplicant: true},
                            {fullName: 'First coApplicant', coApplicantRelationshipToDeceased: 'optionChild', isApplicant: true}
                        ]
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForCoApplicantEmail);
                });
        });

        it(`test it redirects to stop page if child is not adopted in England or Wales: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.pageUrl = CoApplicantAdoptionPlace.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        adoptionPlace: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
