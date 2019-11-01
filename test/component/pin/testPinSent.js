'use strict';

const TestWrapper = require('test/util/TestWrapper');
const PinPage = require('app/steps/ui/pin/signin');
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
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.post('/prepare-session-field/validLink/true')
                        .end(() => {
                            testWrapper.testContent(done);
                        });
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForPinPage}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForPinPage);
        });

        it('test "save and close", "my applications" and "sign out" links are not displayed on the page', (done) => {
            const playbackData = {
                saveAndClose: commonContent.saveAndClose,
                myApplications: commonContent.myApplications,
                signOut: commonContent.signOut
            };

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
