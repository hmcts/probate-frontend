'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AdoptedIn = require('app/steps/ui/details/adoptedin/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');
const testStepName = 'AnyLivingDescendants';
const testStepUrl = '/any-living-descendants';

describe(testStepUrl, () => {
    let testWrapper;
    const expectedNextUrlForAdoptedIn = AdoptedIn.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('hadLivingDescendants');

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

        it(`test it redirects to Adopted in page if deceased no descendants: ${expectedNextUrlForAdoptedIn}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        relationshipToDeceased: 'optionGrandchild',
                        anyLivingDescendants: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAdoptedIn);
                });
        });

        it(`test it redirects to stop page if deceased has descendants: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyLivingDescendants: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
