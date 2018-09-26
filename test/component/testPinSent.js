'use strict';

const TestWrapper = require('test/util/TestWrapper');
const PinPage = require('app/steps/ui/pin/signin/index');
const commonContent = require('app/resources/en/translation/common');

describe('pin-sent', () => {
    let testWrapper;
    const expectedNextUrlForPinPage = PinPage.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('PinSent');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];
            testWrapper.agent.post('/prepare-session-field/validLink/true')
                .end(() => {
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForPinPage}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForPinPage);
        });

        it('test save and close link is not displayed on the page', (done) => {
            const playbackData = {};
            playbackData.saveAndClose = commonContent.saveAndClose;
            playbackData.signOut = commonContent.signOut;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
