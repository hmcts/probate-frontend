'use strict';

const TestWrapper = require('test/util/TestWrapper');
const MentalCapacity = require('app/steps/ui/executors/mentalcapacity/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const commonContent = require('app/resources/en/translation/common');
const cookies = [{
    name: '__eligibility',
    content: {
        nextStepUrl: '/applicant-executor',
        pages: [
            '/will-left',
            '/will-original',
            '/death-certificate',
            '/deceased-domicile'
        ]
    }
}];

describe('applicant-executor', () => {
    let testWrapper;
    const expectedNextUrlForStopPage = StopPage.getUrl('notExecutor');
    const expectedNextUrlForMentalCapacity = MentalCapacity.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantExecutor');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('ApplicantExecutor', cookies);

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, [], {}, cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', [], cookies);
        });

        it(`test it redirects to next page: ${expectedNextUrlForMentalCapacity}`, (done) => {
            const data = {
                executor: 'Yes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForMentalCapacity, cookies);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                executor: 'No'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage, cookies);
        });

        it('test save and close link is not displayed on the page', (done) => {
            const playbackData = {};
            playbackData.saveAndClose = commonContent.saveAndClose;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
