const TestWrapper = require('test/util/TestWrapper'),
    WillDate = require('app/steps/ui/will/date/index'),
    StopPage = require('app/steps/ui/stoppage/index');

describe('will-original', () => {
    let testWrapper;
    const expectedNextUrlForWillDate = WillDate.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('notOriginal');

    beforeEach(() => {
        testWrapper = new TestWrapper('WillOriginal');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to will date: ${expectedNextUrlForWillDate}`, (done) => {
            const data = {
                'original': 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForWillDate);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                'original': 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });

    });
});
