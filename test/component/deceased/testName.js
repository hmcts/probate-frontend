'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedDob = require('app/steps/ui/deceased/dob/index');

describe('deceased-name', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedDob = DeceasedDob.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedName');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {

            testWrapper.testContent(done, []);
        });

        it('test errors message displayed for missing data', (done) => {

            const data = {};

            testWrapper.testErrors(done, data, 'required', []);

        });

        it('test errors message displayed for invalid firstName', (done) => {
            const errorsToTest = ['firstName'];
            const data = {
                firstName: '<dee',
                lastName: 'ceased'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for invalid lastName', (done) => {
            const errorsToTest = ['lastName'];
            const data = {
                firstName: 'dee',
                lastName: '<ceased'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it(`test it redirects to deceased dob page: ${expectedNextUrlForDeceasedDob}`, (done) => {
            const data = {
                firstName: 'Bob',
                lastName: 'Smith'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDob);
        });

    });
});
