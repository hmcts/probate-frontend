'use strict';

const TestWrapper = require('test/util/TestWrapper');
const GrandchildAdoptionPlace = require('app/steps/ui/details/grandchildadoptionplace');
const GrandchildAdoptedOut = require('app/steps/ui/details/grandchildadoptedout');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');

describe('grandchild-adoption-in', () => {
    let testWrapper;
    const expectedNextUrlForGrandchildAdoptionPlace = GrandchildAdoptionPlace.getUrl();
    const expectedNextUrlForGrandchildAdoptedOut = GrandchildAdoptedOut.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('GrandchildAdoptedIn');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('GrandchildAdoptedIn', null, null, [], false, {type: caseTypes.INTESTACY});

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
                },
                applicant: {
                    relationshipToDeceased: 'optionChild'
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

        it(`test it redirects to grandchild Adoption place page if grandchild is adopted in: ${expectedNextUrlForGrandchildAdoptionPlace}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                },
                applicant: {
                    relationshipToDeceased: 'optionGrandchild'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        grandchildAdoptedIn: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForGrandchildAdoptionPlace);
                });
        });

        it(`test it redirects to grandchild adopted out page if grandchild is not adopted in: ${expectedNextUrlForGrandchildAdoptedOut}`, (done) => {
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
                        grandchildAdoptedIn: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForGrandchildAdoptedOut);
                });
        });
    });
});
