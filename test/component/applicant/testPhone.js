const TestWrapper = require('test/util/TestWrapper'),
    ApplicantAddress = require('app/steps/ui/applicant/address/index');

describe('applicant-phone', () => {
    let testWrapper;
    const expectedNextUrlForApplicantAddress = ApplicantAddress.getUrl();


    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantPhone');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it('test errors message displayed for missing Phone Number', (done) => {
            const data = {};
            testWrapper.testErrors(done, data, 'required');
        });

        it(`test it redirects to next page: ${expectedNextUrlForApplicantAddress}`, (done) => {
            const data = {phoneNumber: '1234567890'};
            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantAddress);
        });

    });
});
