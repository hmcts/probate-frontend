'use strict';

const TestWrapper = require('test/util/TestWrapper');
const OtherParentAlive = require('app/steps/ui/deceased/anyotherparentalive');
const SameParents = require('app/steps/ui/applicant/sameparents');
const testCommonContent = require('test/component/common/testCommonContent.js');
const StopPage = require('app/steps/ui/stoppage');
const caseTypes= require('app/utils/CaseTypes');

describe('deceased-adoption-place', () => {
    let testWrapper;
    const expectedNextUrlForOtherParentAlive = OtherParentAlive.getUrl();
    const expectedNextUrlForSameParents = SameParents.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('adoptionNotEnglandOrWales');

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedAdoptionPlace');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedAdoptionPlace', null, null, [], false, {type: caseTypes.INTESTACY});

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

        it(`test it redirects to any other parent alive page if deceased is adopted in England or Wales: ${expectedNextUrlForOtherParentAlive}`, (done) => {
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
                        deceasedAdoptionPlace: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForOtherParentAlive);
                });
        });

        it(`test it redirects to any same parent page if deceased is adopted in England or Wales: ${expectedNextUrlForSameParents}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionNotMarried'
                },
                applicant: {
                    relationshipToDeceased: 'optionSibling'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        deceasedAdoptionPlace: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForSameParents);
                });
        });

        it(`test it redirects to stop page if parent is not adopted in England or Wales: ${expectedNextUrlForStopPage}`, (done) => {
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
                        deceasedAdoptionPlace: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
