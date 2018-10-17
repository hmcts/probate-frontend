'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtCompleted = require('app/steps/ui/iht/completed/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const cookies = [{
    name: '__eligibility',
    content: {
        nextStepUrl: '/mental-capacity',
        pages: [
            '/will-left',
            '/will-original',
            '/death-certificate',
            '/deceased-domicile',
            '/applicant-executor'
        ]
    }
}];

describe('mental-capacity', () => {
    let testWrapper;
    const expectedNextUrlForStopPage = StopPage.getUrl('mentalCapacity');
    const expectedNextUrlForIhtCompleted = IhtCompleted.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('MentalCapacity');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        testHelpBlockContent.runTest('MentalCapacity', cookies);

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys, {}, cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', [], cookies);
        });

        it(`test it redirects to IHT Completed page: ${expectedNextUrlForIhtCompleted}`, (done) => {
            const data = {
                mentalCapacity: 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtCompleted, cookies);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                mentalCapacity: 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage, cookies);
        });
    });
});
