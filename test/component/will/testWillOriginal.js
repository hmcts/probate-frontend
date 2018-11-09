'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeathCertificate = require('app/steps/ui/deceased/deathcertificate/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const commonContent = require('app/resources/en/translation/common');
const cookies = [{
    name: '__eligibility',
    content: {
        nextStepUrl: '/will-original',
        pages: [
            '/will-left'
        ]
    }
}];

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
        testHelpBlockContent.runTest('WillOriginal', cookies);

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, [], {}, cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', [], cookies);
        });

        it(`test it redirects to next page: ${expectedNextUrlForDeathCertificate}`, (done) => {
            const data = {
                original: 'Yes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeathCertificate, cookies);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                original: 'No'
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
