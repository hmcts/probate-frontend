const TestWrapper = require('test/util/TestWrapper'),
    PinPage = require('app/steps/ui/pin/signin/index');

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
    });
});
