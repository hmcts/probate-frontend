'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist');
const ApplicantNameAsOnWill = require('app/steps/ui/applicant/nameasonwill');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('save-and-close', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();
    const expectedNextUrlForApplicantNameAsOnWill = ApplicantNameAsOnWill.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantName');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantName');

        it(`test isSaveAndClose ture redirects to next page: ${expectedNextUrlForTaskList}`, (done) => {
            const data = {
                isSaveAndClose: 'true',
                firstName: 'bob',
                lastName: 'smith'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
        });

        it(`test isSaveAndClose false redirects to next page: ${expectedNextUrlForApplicantNameAsOnWill}`, (done) => {
            const data = {
                isSaveAndClose: 'false',
                firstName: 'bob',
                lastName: 'smith'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantNameAsOnWill);
        });
    });
});
