'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtMethod = require('app/steps/ui/iht/method/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

const nock = require('nock');
const config = require('app/config');
const featureToggleUrl = config.featureToggles.url;
const featureTogglePath = `${config.featureToggles.path}/${config.featureToggles.screening_questions}`;

describe('iht-completed', () => {
    let testWrapper;
    const expectedNextUrlForIhtMethod = IhtMethod.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('ihtNotCompleted');

    beforeEach(() => {
        testWrapper = new TestWrapper('IhtCompleted');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        testHelpBlockContent.runTest('IhtCompleted');

        it('test right content loaded on the page', (done) => {
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'false');

            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to next page: ${expectedNextUrlForIhtMethod}`, (done) => {
            const data = {
                completed: 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                completed: 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });

    });
});
