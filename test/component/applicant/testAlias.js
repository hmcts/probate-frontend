'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantAliasReason = require('app/steps/ui/applicant/aliasreason');
const caseTypes = require('app/utils/CaseTypes');

describe('applicant-alias', () => {
    let testWrapper;
    const expectedNextUrlForApplicantAliasReason = ApplicantAliasReason.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantAlias');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };
            const contentToExclude = ['nameOnWillQuestionSummary', 'nameOnWill'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
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
