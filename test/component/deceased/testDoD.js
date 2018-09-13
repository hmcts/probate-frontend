'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAddress = require('app/steps/ui/deceased/address/index');

describe('deceased-dod', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedAddress = DeceasedAddress.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedDod');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            testWrapper.testContent(done, []);
        });

        it('test error message displayed for missing data', (done) => {
            const errorsToTest = ['dod_day', 'dod_month', 'dod_year'];
            const data = {};

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test error message displayed for invalid date', (done) => {
            const errorsToTest = ['dod_date'];
            const data = {dod_day: '31', dod_month: '9', dod_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric field', (done) => {
            const errorsToTest = ['dod_day'];
            const data = {dod_day: 'ab', dod_month: '09', dod_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for three digits in year field', (done) => {
            const errorsToTest = ['dod_year'];
            const data = {dod_day: '12', dod_month: '9', dod_year: '200'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it(`test it redirects to deceased address page: ${expectedNextUrlForDeceasedAddress}`, (done) => {
            const data = {
                dod_day: '01',
                dod_month: '01',
                dod_year: '2000'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAddress);
        });

    });
});
