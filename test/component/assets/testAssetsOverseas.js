'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CopiesOverseas = require('app/steps/ui/copies/overseas');
const CopiesSummary = require('app/steps/ui/copies/summary');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('assets-overseas', () => {
    let testWrapper;
    const expectedNextUrlForCopiesOverseas = CopiesOverseas.getUrl();
    const expectedNextUrlForCopiesSummary = CopiesSummary.getUrl();
    const declarationCheckboxSessionData = {
        declaration: {
            declarationCheckbox: 'true'
        }
    };

    beforeEach(() => {
        testWrapper = new TestWrapper('AssetsOverseas');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AssetsOverseas', null, null, [], false, {ccdCase: {state: 'CaseCreated'}, declaration: {declarationCheckbox: 'true'}});

        it('test content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                },
                declaration: {
                    declarationCheckbox: 'true'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, contentData);
                });
        });

        it(`test it redirects to Copies Overseas page: ${expectedNextUrlForCopiesOverseas}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(declarationCheckboxSessionData)
                .end(() => {
                    const data = {assetsoverseas: 'optionYes'};

                    testWrapper.nextPageUrl = testWrapper.nextStep(data).constructor.getUrl();
                    testWrapper.testRedirect(done, data, expectedNextUrlForCopiesOverseas);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForCopiesSummary}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(declarationCheckboxSessionData)
                .end(() => {
                    const data = {assetsoverseas: 'optionNo'};

                    testWrapper.nextPageUrl = testWrapper.nextStep(data).constructor.getUrl();
                    testWrapper.testRedirect(done, data, expectedNextUrlForCopiesSummary);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(declarationCheckboxSessionData)
                .end(() => {
                    testWrapper.testErrors(done, {}, 'required');
                });
        });
    });
});
