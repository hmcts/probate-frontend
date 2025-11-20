'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAdoptionPlace = require('app/steps/ui/applicant/deceasedadoptionplace');
const DeceasedAdoptedOut = require('app/steps/ui/applicant/deceasedadoptedout');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');

describe('deceased-adoption-in', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedAdoptionPlace = DeceasedAdoptionPlace.getUrl();
    const expectedNextUrlForDeceasedAdoptedOut = DeceasedAdoptedOut.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedAdoptedIn');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedAdoptedIn', null, null, [], false, {type: caseTypes.INTESTACY});

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

        it(`test it redirects to deceased Adoption place page if deceased is adopted in: ${expectedNextUrlForDeceasedAdoptionPlace}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionNotMarried',
                },
                applicant: {
                    relationshipToDeceased: 'optionParent'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        deceasedAdoptedIn: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAdoptionPlace);
                });
        });

        it(`test it redirects to deceased adopted out page if deceased is not adopted in: ${expectedNextUrlForDeceasedAdoptedOut}`, (done) => {
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
                        deceasedAdoptedIn: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAdoptedOut);
                });
        });
    });
});
