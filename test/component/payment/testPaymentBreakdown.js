const TestWrapper = require('test/util/TestWrapper');

describe('payment-breakdown', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('PaymentBreakdown');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test content loaded on the page with no extra copies', (done) => {
            const contentToExclude = ['extraCopiesFeeUk', 'extraCopiesFeeJersey', 'extraCopiesFeeOverseas'];
            testWrapper.testContent(done, contentToExclude);
        });

        it('test it displays the UK copies fees', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({copies: {uk: 1}})
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const contentToExclude = ['extraCopiesFeeJersey', 'extraCopiesFeeOverseas'];
                    testWrapper.testContent(done, contentToExclude);
                });
        });
        it('test it displays the overseas copies fees', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({copies: {overseas: 1}, assets: {assetsoverseas: 'Yes'}})
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const contentToExclude = ['extraCopiesFeeJersey', 'extraCopiesFeeUk'];
                    testWrapper.testContent(done, contentToExclude);
                });
        });
        it('test error message displayed for failed authorisation', (done) => {
            const data = {};
            testWrapper.testErrors(done, data, 'failure', ['authorisation']);
        });
    });
});
