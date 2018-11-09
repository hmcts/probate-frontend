'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedDomicile = require('app/steps/ui/deceased/domicile/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const commonContent = require('app/resources/en/translation/common');
const cookies = [{
    name: '__eligibility',
    content: {
        nextStepUrl: '/death-certificate',
        pages: [
            '/will-left',
            '/will-original'
        ]
    }
}];

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
        testHelpBlockContent.runTest('DeathCertificate', cookies);

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, [], {}, cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', [], cookies);
        });

        it(`test it redirects to next page: ${expectedNextUrlForDeceasedDomicile}`, (done) => {
            const data = {
                deathCertificate: 'Yes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDomicile, cookies);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                deathCertificate: 'No'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage, cookies);
        });

        it('test save and close link is not displayed on the page', (done) => {
            const playbackData = {};
            playbackData.saveAndClose = commonContent.saveAndClose;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
