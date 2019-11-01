'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantPhone = require('app/steps/ui/applicant/phone');
const content = require('app/resources/en/translation/applicant/aliasreason');

describe('applicant-alias-reason', () => {
    let testWrapper;
    const expectedNextUrlForApplicantPhone = ApplicantPhone.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantAliasReason');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
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

        it('test alias reason validation when no data is entered', (done) => {
            const errorsToTest = ['aliasReason'];

            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it('test alias reason validation when other is selected but no reason is entered', (done) => {
            const errorsToTest = ['otherReason'];
            const data = {
                aliasReason: content.optionOther.toLowerCase(),
                otherReason: ''
            };

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it(`test it redirects to next page: ${expectedNextUrlForApplicantPhone}`, (done) => {
            const data = {
                aliasReason: content.optionDivorce
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantPhone);
        });

        it(`test it redirects to next page when Other is chosen: ${expectedNextUrlForApplicantPhone}`, (done) => {
            const data = {
                aliasReason: content.optionOther,
                otherReason: 'Because I wanted to'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantPhone);
        });
    });
});
