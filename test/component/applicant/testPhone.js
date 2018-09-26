'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantAddress = require('app/steps/ui/applicant/address/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

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

        testHelpBlockContent.runTest('WillLeft');

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
