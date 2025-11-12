'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AnyGrandchildrenUnder18 = require('app/steps/ui/deceased/anygrandchildrenunder18/index');
const GrandchildParentHasOtherChildren = require('app/steps/ui/deceased/grandchildparenthasotherchildren/index');
const AllChildrenOver18 = require('app/steps/ui/deceased/allchildrenover18/index');
const ApplicantName = require('app/steps/ui/applicant/name/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('any-surviving-grandchildren', () => {
    let testWrapper;
    const expectedNextUrlForAnyGrandchildrenUnder18 = AnyGrandchildrenUnder18.getUrl();
    const expectedNextUrlForAllChildrenOver18 = AllChildrenOver18.getUrl();
    const expectedNextUrlForGrandchildParentHasOtherChildren = GrandchildParentHasOtherChildren.getUrl();
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('AnySurvivingGrandchildren');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AnySurvivingGrandchildren', null, null, [], false, {type: caseTypes.INTESTACY});

        it('test content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.INTESTACY,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    'firstName': 'John',
                    'lastName': 'Doe',
                    'dod-day': 13,
                    'dod-month': 10,
                    'dod-year': 2018,
                    'dod-formattedDate': '13 October 2018'
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

        it(`test it redirects to Any grandchildren under 18 page if surviving children are there: ${expectedNextUrlForAnyGrandchildrenUnder18}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anySurvivingGrandchildren: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnyGrandchildrenUnder18);
                });
        });
        it(`test it redirects to grandchild over 18 page if some children are predeceased: ${expectedNextUrlForAllChildrenOver18}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyPredeceasedChildren: 'optionYesSome',
                        anySurvivingGrandchildren: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAllChildrenOver18);
                });
        });
        it(`test it redirects to Applicant name page if all children are predeceased and applicant is child: ${expectedNextUrlForApplicantName}`, (done) => {
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
                        anyPredeceasedChildren: 'optionYesAll',
                        anySurvivingGrandchildren: 'optionNo',
                        relationshipToDeceased: 'optionChild'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantName);
                });
        });
        it(`test it redirects to Parent has any children page if all children are predeceased and applicant is grandchild: ${expectedNextUrlForGrandchildParentHasOtherChildren}`, (done) => {
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
                        anyPredeceasedChildren: 'optionYesAll',
                        anySurvivingGrandchildren: 'optionNo',
                        relationshipToDeceased: 'optionGrandchild'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForGrandchildParentHasOtherChildren);
                });
        });
    });
});
