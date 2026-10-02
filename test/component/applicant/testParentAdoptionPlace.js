'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AdoptedIn = require('app/steps/ui/applicant/adoptedin');
const testCommonContent = require('test/component/common/testCommonContent.js');
const StopPage = require('app/steps/ui/stoppage');
const caseTypes= require('app/utils/CaseTypes');

describe('applicant-parent-adoption-place', () => {
    let testWrapper;
    const expectedNextUrlForApplicantAdoptedIn = AdoptedIn.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('adoptionNotEnglandOrWales');

    beforeEach(() => {
        testWrapper = new TestWrapper('ParentAdoptionPlace');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ParentAdoptionPlace', null, null, [], false, {type: caseTypes.INTESTACY});

        it('test content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.INTESTACY,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to any other children page if grandchild parent is adopted in England or Wales: /intestacy${expectedNextUrlForApplicantAdoptedIn}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                },
                applicant: {
                    relationshipToDeceased: 'optionGrandchild'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        parentAdoptionPlace: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForApplicantAdoptedIn}`);
                });
        });

        it(`test it redirects to stop page if grandchild parent is not adopted in England or Wales: /intestacy${expectedNextUrlForStopPage}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                },
                applicant: {
                    relationshipToDeceased: 'optionGrandchild'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        parentAdoptionPlace: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForStopPage}`);
                });
        });
    });
});
