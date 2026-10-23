'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AdoptedIn = require('app/steps/ui/applicant/adoptedin');
const testCommonContent = require('test/component/common/testCommonContent.js');
const StopPage = require('app/steps/ui/stoppage');
const caseTypes= require('app/utils/CaseTypes');

describe('applicant-parent-adoption-out', () => {
    let testWrapper;
    const expectedNextUrlForApplicantAdoptedIn = AdoptedIn.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('grandchildParentAdoptedOut');

    beforeEach(() => {
        testWrapper = new TestWrapper('ParentAdoptedOut');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ParentAdoptedOut', null, null, [], false, {type: caseTypes.INTESTACY});
        it('test content loaded on the page for grandchild parent', (done) => {
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
                    testWrapper.testContent(done, {deceasedName: 'John Doe'});
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to stop page if grandchild parent is adopted out: /intestacy${expectedNextUrlForStopPage}`, (done) => {
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
                        parentAdoptedOut: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForStopPage}`);
                });
        });

        it(`test it redirects to any other children page if grandchild parent is not adopted Out: /intestacy${expectedNextUrlForApplicantAdoptedIn}`, (done) => {
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
                        parentAdoptedOut: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForApplicantAdoptedIn}`);
                });
        });
    });
});
