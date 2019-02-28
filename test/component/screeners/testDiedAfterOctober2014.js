'use strict';

const TestWrapper = require('test/util/TestWrapper');
const RelatedToDeceased = require('app/steps/ui/screeners/relatedtodeceased/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const commonContent = require('app/resources/en/translation/common');
const config = require('app/config');
const cookies = [{
    name: config.redis.eligibilityCookie.name,
    content: {
        nextStepUrl: '/died-after-october-2014',
        pages: [
            '/death-certificate',
            '/deceased-domicile',
            '/iht-completed',
            '/will-left'
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

describe('died-after-october-2014', () => {
    let testWrapper;
    const expectedNextUrlForRelatedToDeceased = RelatedToDeceased.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('notDiedAfterOctober2014');

    beforeEach(() => {
        testWrapper = new TestWrapper('DiedAfterOctober2014');
        featureTogglesNock();
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DiedAfterOctober2014', featureTogglesNock, cookies);

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, [], {}, cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.agent.post('/prepare-session-field/willLeft/No')
                .end(() => {
                    testWrapper.testErrors(done, {}, 'required', [], cookies);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForRelatedToDeceased}`, (done) => {
            testWrapper.agent.post('/prepare-session-field/willLeft/No')
                .end(() => {
                    const data = {
                        diedAfter: 'Yes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForRelatedToDeceased, cookies);
                });
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session-field/willLeft/No')
                .end(() => {
                    const data = {
                        diedAfter: 'No'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage, cookies);
                });
        });

        it('test save and close link is not displayed on the page', (done) => {
            const playbackData = {};
            playbackData.saveAndClose = commonContent.saveAndClose;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
