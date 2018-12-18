'use strict';

const TestWrapper = require('test/util/TestWrapper');
const NewDeathCertificate = require('app/steps/ui/deceased/newdeathcertificate/index');
const commonContent = require('app/resources/en/translation/common');

const nock = require('nock');
const config = require('app/config');
const featureToggleUrl = config.featureToggles.url;
const featureTogglePath = `${config.featureToggles.path}/${config.featureToggles.screening_questions}`;

describe('new-start-eligibility', () => {
    let testWrapper;
    const expectedNextUrlForNewDeathCertificate = NewDeathCertificate.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('NewStartEligibility');

        nock(featureToggleUrl)
            .get(featureTogglePath)
            .reply(200, 'true');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it(`test it redirects to next page: ${expectedNextUrlForNewDeathCertificate}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForNewDeathCertificate);
        });

        it('test "save and close" and "sign out" links are not displayed on the page', (done) => {
            const playbackData = {};
            playbackData.saveAndClose = commonContent.saveAndClose;
            playbackData.signOut = commonContent.signOut;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
