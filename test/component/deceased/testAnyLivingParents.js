'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AdoptedIn = require('app/steps/ui/details/adoptedin/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');
const StopPage = require('../../../app/steps/ui/stoppage');
const testStepName = 'AnyLivingParents';
const testStepUrl = '/any-living-parents';

describe(testStepUrl, () => {
    let testWrapper;
    const expectedNextUrlForAdoptedIn = AdoptedIn.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('anyLivingParents');

    beforeEach(() => {
        testWrapper = new TestWrapper(testStepName);
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest(testStepName, null, null, [], false, {type: caseTypes.INTESTACY});

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

        it(`test it redirects to AdoptedIn page if No for any Any Living Parent: ${expectedNextUrlForAdoptedIn}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyLivingParent: 'hasNoLivingParents',
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAdoptedIn);
                });
        });

        it(`Test it redirects to Stoppage page if Yes for any Any Living Parent: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyLivingParent: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
