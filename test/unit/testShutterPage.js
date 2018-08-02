const TestWrapper = require('test/util/TestWrapper');
const contentToCheck = require('app/resources/en/translation/shutterpage');
const ShutterPage = require('app/steps/ui/shutterpage/index');

describe('shutter-page', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('ShutterPage');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test content on page', (done) => {
            testWrapper.agent
                .post(ShutterPage.getUrl())
                .end(() => {
                    testWrapper.testDataPlayback(done, contentToCheck);
                });
        });
    });
});
