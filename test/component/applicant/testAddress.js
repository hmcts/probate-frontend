const TestWrapper = require('test/util/TestWrapper'),
    ExecutorsNumber = require('app/steps/ui/executors/number/index');

describe('applicant-address', () => {
    let testWrapper;
    const expectedNextUrlForExecsNumber = ExecutorsNumber.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantAddress');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const excludeKeys = ['selectAddress'];
            testWrapper.testContent(done, excludeKeys);
        });

        it('test error messages displayed for missing data', (done) => {
            const data = {addressFound: 'none'};

            testWrapper.testErrors(done, data, 'required', ['postcodeLookup']);
        });

        it('test validation when address search is successful, but no address is selected/entered', (done) => {
            const data = {addressFound: 'true'};

            testWrapper.testErrors(done, data, 'oneOf', ['crossField']);

        });

        it('test address validation when address search is successful, and two addresses are provided', (done) => {
            const data = {
                addressFound: 'true',
                freeTextAddress: 'free text address',
                postcodeAddress: 'postcode address'
            };

            testWrapper.testErrors(done, data, 'oneOf', ['crossField']);

        });

        it('test address validation when address search is unsuccessful', (done) => {
            const data = {
                addressFound: 'false'
            };

            testWrapper.testErrors(done, data, 'required', ['freeTextAddress']);

        });

        it(`test it redirects to number of executors page: ${expectedNextUrlForExecsNumber}`, (done) => {
            const data = {
                postcode: 'ea1 eaf',
                postcodeAddress: '102 Petty France'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForExecsNumber);
        });

    });
});
