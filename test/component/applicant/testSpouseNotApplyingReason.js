'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AnyOtherChildren = require('app/steps/ui/deceased/anyotherchildren/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const content = require('app/resources/en/translation/applicant/spousenotapplyingreason');
const caseTypes = require('app/utils/CaseTypes');

describe('spouse-not-applying-reason', () => {
    let testWrapper;
    const expectedNextUrlForAnyOtherChildren = AnyOtherChildren.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('spouseNotApplying');

    beforeEach(() => {
        testWrapper = new TestWrapper('SpouseNotApplyingReason');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('SpouseNotApplyingReason');

        it('test content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            const contentToExclude = ['theDeceased'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to Any Other Children page if spouse renouncing: ${expectedNextUrlForAnyOtherChildren}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        spouseNotApplyingReason: content.optionRenouncing
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnyOtherChildren);
                });
        });

        it(`test it redirects to Any Other Children page if spouse not applying for other reasons: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        spouseNotApplyingReason: content.optionOther
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
