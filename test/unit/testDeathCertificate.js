'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtCompletedPage = require('app/steps/ui/iht/completed/index');
const StopPage = require('app/steps/ui/stoppage/index');

describe('death-certificate', () => {
    let testWrapper;
    const expectedNextUrlForIhtCompletedPage = IhtCompletedPage.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('deathCertificate');

    beforeEach(() => {
        testWrapper = new TestWrapper('DeathCertificate');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, [], {});
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};
            testWrapper.testErrors(done, data, 'required');
        });

        it(`test it redirects to the iht complete page if the main applicant has the death certificate: ${expectedNextUrlForIhtCompletedPage}`, (done) => {
            const data = {
                'deathCertificate': 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtCompletedPage);
        });

        it(`test it redirects to the stop page if the main applicant does not have the death certificate: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                'deathCertificate': 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });
    });
});
