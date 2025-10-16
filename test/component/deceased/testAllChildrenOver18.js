'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AnyDeceasedChildren = require('app/steps/ui/deceased/anydeceasedchildren/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
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
        testCommonContent.runTest('AllChildrenOver18', null, null, [], false, {type: caseTypes.INTESTACY});

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

        it(`test it redirects to Any Deceased Children page if deceased children were all over 18: /intestacy${expectedNextUrlForAnyDeceasedChildren}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        allChildrenOver18: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAnyDeceasedChildren}`);
                });
        });

        it(`test it redirects to Stop page if some deceased children were under 18: /intestacy${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        allChildrenOver18: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForStopPage}`);
                });
        });
    });
});
