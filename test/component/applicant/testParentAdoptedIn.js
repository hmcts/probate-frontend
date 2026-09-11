'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ParentAdoptionPlace = require('app/steps/ui/applicant/parentadoptionplace');
const ParentAdoptedOut = require('app/steps/ui/applicant/parentadoptedout');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');

describe('applicant-parent-adoption-in', () => {
    let testWrapper;
    const expectedNextUrlForParentAdoptionPlace = ParentAdoptionPlace.getUrl();
    const expectedNextUrlForParentAdoptedOut = ParentAdoptedOut.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ParentAdoptedIn');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ParentAdoptedIn', null, null, [], false, {type: caseTypes.INTESTACY});

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
                    relationshipToDeceased: 'optionGrandchild'
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

        it(`test it redirects to grandchild parent Adoption place page if grandchild parent is adopted in: /intestacy${expectedNextUrlForParentAdoptionPlace}`, (done) => {
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
                        parentAdoptedIn: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForParentAdoptionPlace}`);
                });
        });

        it(`test it redirects to grandchild parent adopted out page if grandchild parent is not adopted in: /intestacy${expectedNextUrlForParentAdoptedOut}`, (done) => {
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
                        parentAdoptedIn: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForParentAdoptedOut}`);
                });
        });
    });
});
