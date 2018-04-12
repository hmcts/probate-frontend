const TestWrapper = require('test/util/TestWrapper'),
    WillCodicils = require('app/steps/ui/will/codicils/index');

describe('will-date', () => {
    let testWrapper;
    const expectedNextUrlForWillCodicilsNo = WillCodicils.getUrl();
    const expectedNextUrlForWillCodicilsYes = WillCodicils.getUrl(1);

    beforeEach(() => {
        testWrapper = new TestWrapper('WillDate');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {

            testWrapper.testContent(done, []);
        });

        it('test errors message displayed for not selecting an option', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', ['isWillDate']);

        });

        it('test errors message displayed for missing data', (done) => {
            const data = {
                'isWillDate': 'Yes'
            };
            const  errorsToTest = ['willDate_day', 'willDate_month', 'willDate_year']

            testWrapper.testErrors(done, data, 'required', errorsToTest);

        });

        it(`test it redirects to next page when no is selected: ${expectedNextUrlForWillCodicilsNo}`, (done) => {
            const data = {
                isWillDate: 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForWillCodicilsNo);
        });

        it(`test it redirects to next page when yes is selected: ${expectedNextUrlForWillCodicilsYes}`, (done) => {
            const data = {
                isWillDate: 'Yes',
                willDate_day: '01',
                willDate_month: '01',
                willDate_year: '2000'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForWillCodicilsYes);
        });

    });
});
