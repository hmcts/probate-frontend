'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantName = require('app/steps/ui/applicant/name/index');
const AllChildrenOver18 = require('app/steps/ui/deceased/allchildrenover18/index');
const GrandchildParentHasOtherChildren = require('app/steps/ui/deceased/grandchildparenthasotherchildren/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('any-grandchildren-under-18', () => {
    let testWrapper;
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();
    const expectedNextUrlForAllChildrenOver18 = AllChildrenOver18.getUrl();
    const expectedNextUrlForGrandchildParentHasOtherChildren = GrandchildParentHasOtherChildren.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('grandchildrenUnder18');

    beforeEach(() => {
        testWrapper = new TestWrapper('AnyGrandchildrenUnder18');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AnyGrandchildrenUnder18', null, null, [], false, {type: caseTypes.INTESTACY});

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
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to Applicant Name page if no grandchildren are under 18 and no predeceased children and applicant is child: ${expectedNextUrlForApplicantName}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                applicant: {
                    relationshipToDeceased: 'optionChild'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        anyGrandchildrenUnder18: 'optionNo',
                        anyPredeceasedChildren: 'optionYesAll',
                        relationshipToDeceased: 'optionChild'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantName);
                });
        });

        it(`test it redirects to Parent has any children page if no grandchildren are under 18 and no predeceased children and applicant is grandchild: ${expectedNextUrlForGrandchildParentHasOtherChildren}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                applicant: {
                    relationshipToDeceased: 'optionGrandchild'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        anyGrandchildrenUnder18: 'optionNo',
                        anyPredeceasedChildren: 'optionYesAll',
                        relationshipToDeceased: 'optionGrandchild'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForGrandchildParentHasOtherChildren);
                });
        });

        it(`test it redirects to All children over 18 page if no grandchildren are under 18 and have some predeceased children: ${expectedNextUrlForAllChildrenOver18}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyGrandchildrenUnder18: 'optionNo',
                        anyPredeceasedChildren: 'optionYesSome'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAllChildrenOver18);
                });
        });

        it(`test it redirects to Stop page if any grandchildren are under 18: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyGrandchildrenUnder18: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
