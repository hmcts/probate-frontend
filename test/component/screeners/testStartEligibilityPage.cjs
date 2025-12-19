'use strict';

const TestWrapper = require('test/util/TestWrapper.cjs');
const DeathCertificate = require('app/steps/ui/screeners/deathcertificate');
const commonContent = require('app/resources/en/translation/common');
const nock = require('nock');

describe('start-eligibility', () => {
    let testWrapper;
    const expectedNextUrlForDeathCertificate = DeathCertificate.getUrl();

    afterEach(async () => {
        nock.cleanAll();
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page', (done) => {
            testWrapper = new TestWrapper('StartEligibility');

            const contentToExclude = [
                'paragraph1',
                'paragraph3'
            ];
            testWrapper.testContent(done, {}, contentToExclude);
        });
    });

    describe('Verify Content, Errors and Redirection', () => {
        beforeEach(() => {
            testWrapper = new TestWrapper('StartEligibility');
        });

        it(`test it redirects to next page: ${expectedNextUrlForDeathCertificate}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForDeathCertificate);
        });

        it('test "save and close" link is not displayed on the page', (done) => {
            const playbackData = {
                saveAndClose: commonContent.saveAndClose
            };
            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
