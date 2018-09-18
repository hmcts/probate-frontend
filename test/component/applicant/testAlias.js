'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantAliasReason = require('app/steps/ui/applicant/aliasreason/index');

describe('applicant-alias', () => {
    let testWrapper;
    const expectedNextUrlForApplicantAliasReason = ApplicantAliasReason.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantAlias');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, ['nameOnWill']);
        });

        it('test error message displayed for missing data', (done) => {
            const errorsToTest = ['alias'];
            const data = {
                alias: ''
            };
            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it(`test it redirects to next page: ${expectedNextUrlForApplicantAliasReason}`, (done) => {
            const data = {
                alias: 'bob richards'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantAliasReason);
        });
    });
});
