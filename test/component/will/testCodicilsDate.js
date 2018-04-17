const TestWrapper = require('test/util/TestWrapper'),
    IhtCompleted = require('app/steps/ui/iht/completed/index');

describe('codicils-date', () => {
    let testWrapper;
    const expectedNextUrlForIhtCompleted = IhtCompleted.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CodicilsDate');
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

            testWrapper.testErrors(done, data, 'required', ['isCodicilsDate']);

        });

        it('test errors message displayed for missing data', (done) => {
            const data = {
                'isCodicilsDate': 'Yes'
            };
            const errorsToTest = ['codicilsDate_day', 'codicilsDate_month', 'codicilsDate_year'];

            testWrapper.testErrors(done, data, 'required', errorsToTest);

        });

        it(`test it redirects to next page when no is selected: ${expectedNextUrlForIhtCompleted}`, (done) => {
            const data = {
                isCodicilsDate: 'No'
            };
            testWrapper.nextPageUrl = testWrapper.nextStep(data).constructor.getUrl();
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtCompleted);
        });

        it(`test it redirects to next page when yes is selected: ${expectedNextUrlForIhtCompleted}`, (done) => {
            const data = {
                isCodicilsDate: 'Yes',
                codicilsDate_day: '01',
                codicilsDate_month: '01',
                codicilsDate_year: '2000'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtCompleted);
        });

    });
});
