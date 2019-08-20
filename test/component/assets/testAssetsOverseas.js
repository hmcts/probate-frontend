'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CopiesOverseas = require('app/steps/ui/copies/overseas');
const CopiesSummary = require('app/steps/ui/copies/summary');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('assets-overseas', () => {
    let testWrapper;
    const expectedNextUrlForCopiesOverseas = CopiesOverseas.getUrl();
    const expectedNextUrlForCopiesSummary = CopiesSummary.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('AssetsOverseas');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AssetsOverseas');

        it('test content loaded on the page', (done) => {
            const sessionData = {
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, [], contentData);
                });
        });

        it(`test it redirects to Copies Overseas page: ${expectedNextUrlForCopiesOverseas}`, (done) => {
            const data = {assetsoverseas: 'Yes'};
            testWrapper.nextPageUrl = testWrapper.nextStep(data).constructor.getUrl();
            testWrapper.testRedirect(done, data, expectedNextUrlForCopiesOverseas);
        });

        it(`test it redirects to next page: ${expectedNextUrlForCopiesSummary}`, (done) => {
            const data = {assetsoverseas: 'No'};
            testWrapper.nextPageUrl = testWrapper.nextStep(data).constructor.getUrl();
            testWrapper.testRedirect(done, data, expectedNextUrlForCopiesSummary);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });
    });
});
