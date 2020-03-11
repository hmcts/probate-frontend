'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedDomicile = require('app/steps/ui/screeners/deceaseddomicile');
const StopPage = require('app/steps/ui/stoppage');
const testCommonContent = require('test/component/common/testCommonContent.js');
const commonContent = require('app/resources/en/translation/common');
const config = require('config');

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
        testCommonContent.runTest('DeathCertificate');

        it('test content loaded on the page', (done) => {
            const contentData = {deathReportedToCoroner: config.links.deathReportedToCoroner};

            testWrapper.testContent(done, contentData);
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to next page: ${expectedNextUrlForDeceasedDomicile}`, (done) => {
            const data = {
                deathCertificate: 'optionYes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDomicile);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                deathCertificate: 'optionNo'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });

        it('test "save and close" link is not displayed on the page', (done) => {
            const playbackData = {
                saveAndClose: commonContent.saveAndClose
            };

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
