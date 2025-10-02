'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AnyOtherChildren = require('app/steps/ui/deceased/anyotherchildren');
const testCommonContent = require('test/component/common/testCommonContent.js');
const StopPage = require('app/steps/ui/stoppage');
const caseTypes= require('app/utils/CaseTypes');

describe('child-adoption-out', () => {
    let testWrapper;
    const expectedNextUrlForAnyOtherChildren = AnyOtherChildren.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('adoptedOut');

    beforeEach(() => {
        testWrapper = new TestWrapper('ChildAdoptedOut');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ChildAdoptedOut', null, null, [], false, {type: caseTypes.INTESTACY});

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
                    testWrapper.testContent(done, {deceasedName: 'John Doe'});
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to stop page if child is adopted out: ${expectedNextUrlForStopPage}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        childAdoptedOut: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });

        it(`test it redirects to any other children page if child is not adopted Out: ${expectedNextUrlForAnyOtherChildren}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        childAdoptedOut: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnyOtherChildren);
                });
        });
    });
});
