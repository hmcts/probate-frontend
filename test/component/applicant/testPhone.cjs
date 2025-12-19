'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantAddress = require('app/steps/ui/applicant/address');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('applicant-phone', () => {
    let testWrapper;
    const expectedNextUrlForApplicantAddress = ApplicantAddress.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantPhone');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantPhone');

        it('test content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing Phone Number', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to next page: ${expectedNextUrlForApplicantAddress}`, (done) => {
            const data = {phoneNumber: '1234567890'};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantAddress);
        });
    });
});
