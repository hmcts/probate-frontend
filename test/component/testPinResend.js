const TestWrapper = require('test/util/TestWrapper'),
    PinSent = require('app/steps/ui/pin/sent/index');

describe('pin-resend', () => {
    let testWrapper;
    const expectedNextUrlForPinSent = PinSent.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('PinResend');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test phone number loads on the page', (done) => {
            const contentData = {
                phoneNumber: '07701111111',
            };

            testWrapper.agent
                .post('/prepare-session-field')
                .send({
                    'phoneNumber': '07701111111',
                    'validLink': true
                })
                .then(function() {
                    testWrapper.testContent(done, ['subHeader2ExecName'], contentData);
                });
        });

        it('test lead executor name loads on the page', (done) => {
            const contentData = {
                executorName: 'Works',
            };

            testWrapper.agent
                .post('/prepare-session-field')
                .send({
                    'leadExecutorName': 'Works',
                    'validLink': true
                })
                .then(function() {
                    testWrapper.testContent(done, ['header1', 'header2'], contentData);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForPinSent}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForPinSent);
        });
    });
});
