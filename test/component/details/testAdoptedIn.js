'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AdoptionPlace = require('app/steps/ui/details/adoptionplace');
const AdoptedOut = require('app/steps/ui/details/adoptedout');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');

describe('adoption-in', () => {
    let testWrapper;
    const expectedNextUrlForAdoptionPlace = AdoptionPlace.getUrl();
    const expectedNextUrlForAdoptedOut = AdoptedOut.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('AdoptedIn');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AdoptedIn', null, null, [], false, {type: caseTypes.INTESTACY});

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
            const contentToExclude = ['grandchildQuestion', 'requiredGrandchild'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {deceasedName: 'John Doe'}, contentToExclude);
                });
        });

        it(`test it redirects to child Adoption place page if child is adopted in: ${expectedNextUrlForAdoptionPlace}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                },
                applicant: {
                    relationshipToDeceased: 'optionChild'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        adoptedIn: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAdoptionPlace);
                });
        });

        it(`test it redirects to child adopted out page if child is not adopted in: ${expectedNextUrlForAdoptedOut}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                },
                applicant: {
                    relationshipToDeceased: 'optionChild'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        adoptedIn: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAdoptedOut);
                });
        });
    });
});
