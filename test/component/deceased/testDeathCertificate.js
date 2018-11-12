'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtCompleted = require('app/steps/ui/iht/completed/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('death-certificate', () => {
    let testWrapper;
    const expectedNextUrlForIhtCompleted = IhtCompleted.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('deathCertificate');

    beforeEach(() => {
        testWrapper = new TestWrapper('DeathCertificate');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        testHelpBlockContent.runTest('DeathCertificate');

        it('test right content loaded on the page', (done) => {

            testWrapper.testContent(done, []);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);

        });

        it(`test it redirects to iht completed: ${expectedNextUrlForIhtCompleted}`, (done) => {
            const data = {
                deathCertificate: 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtCompleted);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                deathCertificate: 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });

    });
});
