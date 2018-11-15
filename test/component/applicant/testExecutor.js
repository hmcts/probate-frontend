'use strict';

const TestWrapper = require('test/util/TestWrapper');
const MentalCapacity = require('app/steps/ui/executors/mentalcapacity/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('applicant-executor', () => {
    let testWrapper;
    const expectedNextUrlForMentalCapacity = MentalCapacity.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('notExecutor');

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantExecutor');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('ApplicantExecutor');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};
            testWrapper.testErrors(done, data, 'required');
        });

        it(`test it redirects to mental capacity page if applicant is an executor: ${expectedNextUrlForMentalCapacity}`, (done) => {
            const data = {
                'executor': 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForMentalCapacity);
        });

        it(`test it redirects to stop page if applicant is NOT an executor${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                'executor': 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });
    });
});
