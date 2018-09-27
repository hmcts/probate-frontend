'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantExecutor = require('app/steps/ui/applicant/executor/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('deceased-domicile', () => {
    let testWrapper;
    const expectedNextUrlForApplicantExecutor = ApplicantExecutor.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedDomicile');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        testHelpBlockContent.runTest('WillLeft');

        it('test right content loaded on the page', (done) => {

            testWrapper.testContent(done, []);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);

        });

        it(`test it redirects to Applicant Executor page: ${expectedNextUrlForApplicantExecutor}`, (done) => {
            const data = {
                domicile: 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantExecutor);
        });

    });
});
