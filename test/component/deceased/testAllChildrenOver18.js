'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AnyDeceasedChildren = require('app/steps/ui/deceased/anydeceasedchildren/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const content = require('app/resources/en/translation/deceased/allchildrenover18');
const caseTypes = require('app/utils/CaseTypes');

describe('all-children-over-18', () => {
    let testWrapper;
    const expectedNextUrlForAnyDeceasedChildren = AnyDeceasedChildren.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('childrenUnder18');

    beforeEach(() => {
        testWrapper = new TestWrapper('AllChildrenOver18');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AllChildrenOver18');

        it('test content loaded on the page', (done) => {
            const sessionData = {
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
                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to Any Deceased Children page if deceased children were all over 18: ${expectedNextUrlForAnyDeceasedChildren}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        allChildrenOver18: content.optionYes
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnyDeceasedChildren);
                });
        });

        it(`test it redirects to Stop page if some deceased children were under 18: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        allChildrenOver18: content.optionNo
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
