'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantNameAsOnWill = require('app/steps/ui/applicant/nameasonwill/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('applicant-name', () => {
    let testWrapper;
    const expectedNextUrlForApplicantNameAsOnWill = ApplicantNameAsOnWill.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantName');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        testHelpBlockContent.runTest('WillLeft');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it('test error message displayed for missing data', (done) => {
            const errorsToTest = ['firstName', 'lastName'];
            const data = {
                firstName: '',
                lastName: ''
            };
            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test error message displayed for invalid firstName', (done) => {
            const errorsToTest = ['firstName'];
            const data = {
                firstName: '<dave',
                lastName: 'bassett'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for invalid lastName', (done) => {
            const errorsToTest = ['lastName'];
            const data = {
                firstName: 'dave',
                lastName: '<bassett'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it(`test it redirects to next page: ${expectedNextUrlForApplicantNameAsOnWill}`, (done) => {
            const data = {
                firstName: 'bob',
                lastName: 'smith'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantNameAsOnWill);
        });
    });
});
