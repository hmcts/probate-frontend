'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantExecutor = require('app/steps/ui/applicant/executor/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const cookies = [{
    name: '__eligibility',
    content: {
        nextStepUrl: '/deceased-domicile',
        pages: [
            '/will-left',
            '/will-original',
            '/death-certificate'
        ]
    }
}];

describe('deceased-domicile', () => {
    let testWrapper;
    const expectedNextUrlForStopPage = StopPage.getUrl('notInEnglandOrWales');
    const expectedNextUrlForApplicantExecutor = ApplicantExecutor.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedDomicile');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        testHelpBlockContent.runTest('DeceasedDomicile', cookies);

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys, {}, cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', [], cookies);
        });

        it(`test it redirects to Applicant Executor page: ${expectedNextUrlForApplicantExecutor}`, (done) => {
            const data = {
                domicile: 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantExecutor, cookies);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                domicile: 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage, cookies);
        });

    });
});
