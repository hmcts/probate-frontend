'use strict';

const TestWrapper = require('test/util/TestWrapper');
const StartApply = require('app/steps/ui/startapply/index');
const commonContent = require('app/resources/en/translation/common');

describe('start-eligibility', () => {
    let testWrapper;
    const expectedNextUrlForStartApply = StartApply.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('StartEligibility');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it(`test it redirects to next page: ${expectedNextUrlForStartApply}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForStartApply);
        });

        it('test "save and close" and "sign out" links are not displayed on the page', (done) => {
            const playbackData = {};
            playbackData.saveAndClose = commonContent.saveAndClose;
            playbackData.signOut = commonContent.signOut;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
