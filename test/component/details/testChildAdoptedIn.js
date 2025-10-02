'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ChildAdoptionPlace = require('app/steps/ui/details/childadoptionplace');
const ChildAdoptedOut = require('app/steps/ui/details/childadoptedout');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');

describe('child-adoption-in', () => {
    let testWrapper;
    const expectedNextUrlForChildAdoptionPlace = ChildAdoptionPlace.getUrl();
    const expectedNextUrlForChildAdoptedOut = ChildAdoptedOut.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ChildAdoptedIn');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ChildAdoptedIn', null, null, [], false, {type: caseTypes.INTESTACY});

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
                    testWrapper.testContent(done, {deceasedName: 'John Doe'});
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to child Adoption place page if child is adopted in: ${expectedNextUrlForChildAdoptionPlace}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        childAdoptedIn: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForChildAdoptionPlace);
                });
        });

        it(`test it redirects to child adopted out page if child is not adopted in: ${expectedNextUrlForChildAdoptedOut}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        childAdoptedIn: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForChildAdoptedOut);
                });
        });
    });
});
