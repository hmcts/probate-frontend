'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AnyOtherChildren = require('app/steps/ui/deceased/anyotherchildren');
const testCommonContent = require('test/component/common/testCommonContent.js');
const StopPage = require('app/steps/ui/stoppage');
const caseTypes= require('app/utils/CaseTypes');

describe('child-adoption-place', () => {
    let testWrapper;
    const expectedNextUrlForAnyOtherChildren = AnyOtherChildren.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('adoptionNotEnglandOrWales');

    beforeEach(() => {
        testWrapper = new TestWrapper('ChildAdoptionPlace');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ChildAdoptionPlace', null, null, [], false, {type: caseTypes.INTESTACY});

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
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to any other children page if child is adopted in England or Wales: ${expectedNextUrlForAnyOtherChildren}`, (done) => {
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
                        childAdoptionPlace: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnyOtherChildren);
                });
        });

        it(`test it redirects to stop page if child is not adopted in England or Wales: ${expectedNextUrlForStopPage}`, (done) => {
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
                        childAdoptionPlace: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
