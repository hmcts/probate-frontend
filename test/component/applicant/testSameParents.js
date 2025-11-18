'use strict';

const TestWrapper = require('test/util/TestWrapper');
const WholeBloodSibling = require('app/steps/ui/applicant/spousenotapplyingreason');
const HalfBloodSibling = require('app/steps/ui/deceased/anyotherchildren');
const StopPage = require('app/steps/ui/stoppage');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes= require('app/utils/CaseTypes');

describe('same-parents', () => {
    let testWrapper;
    const expectedNextUrlForWholeBloodSibling = WholeBloodSibling.getUrl();
    const expectedNextUrlForHalfBloodSibling = HalfBloodSibling.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('sameParents');

    beforeEach(() => {
        testWrapper = new TestWrapper('SameParents');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('SameParents', null, null, [], false, {type: caseTypes.INTESTACY});

        it('test content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.INTESTACY,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                applicant: {
                    relationshipToDeceased: 'optionSibling'
                },
                deceased: {
                    firstName: 'DECEASED',
                    lastName: 'NAME',
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

        it(`test it redirects to Whole Blood Sibling if both parents are the same: ${expectedNextUrlForWholeBloodSibling}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    sameParents: 'optionBothParentsSame'
                },
                applicant: {
                    relationshipToDeceased: 'optionSibling'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        sameParents: 'optionBothParentsSame'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForWholeBloodSibling);
                });
        });

        it(`test it redirects to Half Blood Sibling page if only one parent is the same: ${expectedNextUrlForHalfBloodSibling}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionDivorced'
                },
                applicant: {
                    relationshipToDeceased: 'optionSibling'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        sameParents: 'optionOneParentsSame'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForHalfBloodSibling);
                });
        });

        it(`test it redirects to Stop page if adoption took place outside England or Wales: ${expectedNextUrlForStopPage}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionDivorced'
                },
                applicant: {
                    relationshipToDeceased: 'optionSibling'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        sameParents: 'optionNoParentsSame'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
