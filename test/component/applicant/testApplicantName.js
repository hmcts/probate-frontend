'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantNameAsOnWill = require('app/steps/ui/applicant/nameasonwill');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('applicant-name', () => {
    let testWrapper;
    const expectedNextUrlForApplicantNameAsOnWill = ApplicantNameAsOnWill.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantName');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantName');

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

        it('test error message displayed for missing data', (done) => {
            const errorsToTest = ['firstName', 'lastName'];
            const data = {
                firstName: '',
                lastName: ''
            };

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test error message displayed for required firstName if stripped out by sanitiser', (done) => {
            const errorsToTest = ['firstName'];
            const data = {
                firstName: '<dave>',
                lastName: 'bassett'
            };

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test error message displayed for invalid firstName', (done) => {
            const errorsToTest = ['firstName'];
            const data = {
                firstName: 'dave>',
                lastName: 'bassett'
            };

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for invalid lastName', (done) => {
            const errorsToTest = ['lastName'];
            const data = {
                firstName: 'dave',
                lastName: '>bassett'
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
