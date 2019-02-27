'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedDomicile = require('app/steps/ui/screeners/deceaseddomicile/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const commonContent = require('app/resources/en/translation/common');
const config = require('app/config');

describe('death-certificate', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedDomicile = DeceasedDomicile.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('deathCertificate');

    beforeEach(() => {
        testWrapper = new TestWrapper('DeathCertificate');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DeathCertificate');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, [], {deathReportedToCoroner: config.links.deathReportedToCoroner});
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required', []);
        });

        it(`test it redirects to next page: ${expectedNextUrlForDeceasedDomicile}`, (done) => {
            const data = {
                deathCertificate: 'Yes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDomicile);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                deathCertificate: 'No'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });

        it('test "save and close" and "sign out" links are not displayed on the page', (done) => {
            const playbackData = {};
            playbackData.saveAndClose = commonContent.saveAndClose;
            playbackData.signOut = commonContent.signOut;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
