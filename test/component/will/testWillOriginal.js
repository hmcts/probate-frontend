'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeathCertificate = require('app/steps/ui/deceased/deathcertificate/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('will-original', () => {
    let testWrapper;
    const expectedNextUrlForStopPage = StopPage.getUrl('notOriginal');
    const expectedNextUrlForDeathCertificate = DeathCertificate.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('WillOriginal');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        testHelpBlockContent.runTest('WillLeft');

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to Death Certificate page: ${expectedNextUrlForDeathCertificate}`, (done) => {
            const data = {
                'original': 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeathCertificate);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                'original': 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });

    });
});
