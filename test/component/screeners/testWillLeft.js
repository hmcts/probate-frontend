'use strict';

const TestWrapper = require('test/util/TestWrapper');
const WillOriginal = require('app/steps/ui/screeners/willoriginal/index');
const DiedAfterOctober2014 = require('app/steps/ui/screeners/diedafteroctober2014/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const commonContent = require('app/resources/en/translation/common');
const config = require('app/config');
const cookies = [{
    name: config.redis.eligibilityCookie.name,
    content: {
        nextStepUrl: '/will-left',
        pages: [
            '/death-certificate',
            '/deceased-domicile',
            '/iht-completed'
        ]
    }
}];

const nock = require('nock');
const featureToggleUrl = config.featureToggles.url;
const intestacyQuestionsFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.intestacy_questions}`;
const featureTogglesNock = (status = 'true') => {
    nock(featureToggleUrl)
        .get(intestacyQuestionsFeatureTogglePath)
        .reply(200, status);
};

describe('will-left', () => {
    let testWrapper;
    const expectedNextUrlForWillOriginal = WillOriginal.getUrl();
    const expectedNextUrlForDiedAfterOctober2014 = DiedAfterOctober2014.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('noWill');

    beforeEach(() => {
        testWrapper = new TestWrapper('WillLeft');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('WillLeft', null, cookies);

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, [], {}, cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required', [], cookies);
        });

        it(`test it redirects to next page: ${expectedNextUrlForWillOriginal}`, (done) => {
            const data = {
                left: 'Yes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForWillOriginal, cookies);
        });

        it(`test it redirects to next page: ${expectedNextUrlForDiedAfterOctober2014}`, (done) => {
            featureTogglesNock('true');

            const data = {
                left: 'No'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDiedAfterOctober2014, cookies);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            featureTogglesNock('false');

            const data = {
                left: 'No'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage, cookies);
        });

        it('test "save and close" and "sign out" links are not displayed on the page', (done) => {
            const playbackData = {};
            playbackData.saveAndClose = commonContent.saveAndClose;
            playbackData.signOut = commonContent.signOut;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
