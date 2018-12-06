'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CopiesOverseas = require('app/steps/ui/copies/overseas/index');
const CopiesSummary = require('app/steps/ui/copies/summary/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

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
        testHelpBlockContent.runTest('AssetsOverseas');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
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
