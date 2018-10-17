'use strict';

const TestWrapper = require('test/util/TestWrapper');
const MentalCapacity = require('app/steps/ui/executors/mentalcapacity/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('applicant-executor', () => {
    let testWrapper;
    let cookies;
    const expectedNextUrlForStopPage = StopPage.getUrl('notExecutor');
    const expectedNextUrlForMentalCapacity = MentalCapacity.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantExecutor');

        cookies = [{
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
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it ('test the help block content is present', () => {
            testHelpBlockContent.runTest('ApplicantExecutor', cookies);
        });

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys, {}, cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', [], cookies);
        });

        it(`test it redirects to Mental Capacity page: ${expectedNextUrlForMentalCapacity}`, (done) => {
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
    });
});
