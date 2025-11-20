'use strict';

const TestWrapper = require('test/util/TestWrapper');
const OtherParentAlive = require('app/steps/ui/deceased/anyotherparentalive');
const testCommonContent = require('test/component/common/testCommonContent.js');
const StopPage = require('app/steps/ui/stoppage');
const caseTypes= require('app/utils/CaseTypes');

describe('deceased-adoption-out', () => {
    let testWrapper;
    const expectedNextUrlForOtherParentAlive = OtherParentAlive.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('deceasedAdoptedOut');

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedAdoptedOut');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedAdoptedOut', null, null, [], false, {type: caseTypes.INTESTACY});
        it('test content loaded on the page for deceased adopted out', (done) => {
            const sessionData = {
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
                    relationshipToDeceased: 'optionParent'
                }
            };
            const contentToExclude = ['siblingQuestion', 'requiredSibling'];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {deceasedName: 'John Doe'}, contentToExclude);
                });
        });

        it(`test it redirects to stop page if deceased is adopted out: ${expectedNextUrlForStopPage}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionNotMarried'
                },
                applicant: {
                    relationshipToDeceased: 'optionParent'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        deceasedAdoptedOut: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });

        it(`test it redirects to any other parent alive page if grandchild is not adopted Out: ${expectedNextUrlForOtherParentAlive}`, (done) => {
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
                        deceasedAdoptedOut: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForOtherParentAlive);
                });
        });
    });
});
