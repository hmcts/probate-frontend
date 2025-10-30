'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AnyPredeceasedChildren = require('app/steps/ui/deceased/anypredeceasedchildren/index');
const ApplicantName = require('app/steps/ui/applicant/name/index');
const GrandchildParentHasOtherChildren = require('app/steps/ui/deceased/grandchildparenthasotherchildren/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('any-other-children', () => {
    let testWrapper;
    const expectedNextUrlForAnyPredeceasedChildren = AnyPredeceasedChildren.getUrl();
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();
    const expectedNextUrlForGrandchildParentHasOtherChildren = GrandchildParentHasOtherChildren.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('AnyOtherChildren');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AnyOtherChildren', null, null, [], false, {type: caseTypes.INTESTACY});

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
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to Any Predeceased children page if deceased had other children: ${expectedNextUrlForAnyPredeceasedChildren}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        relationshipToDeceased: 'optionChild',
                        anyOtherChildren: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnyPredeceasedChildren);
                });
        });

        it(`test it redirects to Applicant Name page if deceased had no other children: ${expectedNextUrlForApplicantName}`, (done) => {
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
                        relationshipToDeceased: 'optionChild',
                        anyOtherChildren: 'optionNo',
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantName);
                });
        });
        it(`test it redirects to Grandchild parent has other children page if deceased had no other children and applicant is grandchild: ${expectedNextUrlForGrandchildParentHasOtherChildren}`, (done) => {
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
                        relationshipToDeceased: 'optionGrandchild',
                        anyOtherChildren: 'optionNo',
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForGrandchildParentHasOtherChildren);
                });
        });
    });
});
