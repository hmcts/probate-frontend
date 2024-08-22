'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantPhone = require('app/steps/ui/applicant/phone');
const caseTypes = require('app/utils/CaseTypes');

describe('applicant-alias-reason', () => {
    let testWrapper;
    const expectedNextUrlForApplicantPhone = ApplicantPhone.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantAliasReason');
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

            const contentToExclude = ['reasonForNameChangeQuestionSummary'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test alias reason validation when no data is entered', (done) => {
            const errorsToTest = ['aliasReason'];

            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it('test alias reason validation when other is selected but no reason is entered', (done) => {
            const errorsToTest = ['otherReason'];
            const data = {
                aliasReason: 'optionOther',
                otherReason: ''
            };

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it(`test it redirects to next page: ${expectedNextUrlForApplicantPhone}`, (done) => {
            const data = {
                aliasReason: 'optionDivorce'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantPhone);
        });

        it(`test it redirects to next page when Other is chosen: ${expectedNextUrlForApplicantPhone}`, (done) => {
            const data = {
                aliasReason: 'optionOther',
                otherReason: 'Because I wanted to'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantPhone);
        });
    });
});
