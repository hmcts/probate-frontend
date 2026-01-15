'use strict';

const TestWrapper = require('test/util/TestWrapper');
const GrandchildParentHasAllChildrenOver18 = require('app/steps/ui/deceased/grandchildparenthasallchildrenover18/index');
const ApplicantName = require('app/steps/ui/applicant/name/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('grandchild-parent-has-other-children', () => {
    let testWrapper;
    const expectedNextUrlForGrandchildParentHasAllChildrenOver18 = GrandchildParentHasAllChildrenOver18.getUrl();
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('GrandchildParentHasOtherChildren');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('GrandchildParentHasOtherChildren', null, null, [], false, {type: caseTypes.INTESTACY});

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
                    const contentToExclude = ['theDeceased'];

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to children age page if grandchild parent had other children: ${expectedNextUrlForGrandchildParentHasAllChildrenOver18}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        relationshipToDeceased: 'optionGrandchild',
                        grandchildParentHasOtherChildren: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForGrandchildParentHasAllChildrenOver18);
                });
        });

        it(`test it redirects to Applicant Name page if grandchild parent had no other children: ${expectedNextUrlForApplicantName}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        grandchildParentHasOtherChildren: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantName);
                });
        });
    });
});
