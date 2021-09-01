'use strict';

const TestWrapper = require('test/util/TestWrapper');
const Dashboard = require('app/steps/ui/dashboard');
const commonContent = require('app/resources/en/translation/common');
const config = require('config');
const cookies = [{
    name: config.redis.eligibilityCookie.name,
    content: {
        nextStepUrl: '/start-apply*',
        pages: [
            '/death-certificate',
            '/deceased-domicile',
            '/iht-completed',
            '/will-left',
            '/will-original',
            '/applicant-executor',
            '/mental-capacity'
        ]
    }
}];

describe('start-apply', () => {
    let testWrapper;
    const expectedNextUrlForDashboard = Dashboard.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('StartApply');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, {}, [], cookies);
        });

        it(`test it redirects to next page: ${expectedNextUrlForDashboard}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForDashboard, cookies);
        });

        it('test "save and close" link is not displayed on the page', (done) => {
            const playbackData = {
                saveAndClose: commonContent.saveAndClose
            };

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
