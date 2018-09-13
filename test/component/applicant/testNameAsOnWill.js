'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantPhone = require('app/steps/ui/applicant/phone/index');

describe('applicant-nameasonwill', () => {
    let testWrapper;
    const expectedNextUrlForApplicantPhone = ApplicantPhone.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantNameAsOnWill');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test correct content is loaded on the page', (done) => {
            const sessionData = {
                'applicant': {
                    'firstName': 'john', 'lastName': 'theapplicant'
                 }
            };

            const excludeKeys = ['questionWithoutName', 'questionWithCodicil', 'legendWithCodicil'];

            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {

                const contentData = {
                    applicantName: 'john theapplicant',
                };
                testWrapper.testContent(done, excludeKeys, contentData);
            });
        });

        it('test correct content is loaded on the page when there is a codicil', (done) => {
            const sessionData = {
                'applicant': {
                    'firstName': 'john', 'lastName': 'theapplicant'
                 },
                 will: {
                     codicils: 'Yes'
                 }
            };

            const excludeKeys = ['question', 'questionWithoutName', 'legend'];

            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {

                const contentData = {
                    applicantName: 'john theapplicant',
                };
                testWrapper.testContent(done, excludeKeys, contentData);
            });
        });

        it('test errors message displayed for missing data', (done) => {
            const sessionData = {
                'applicant': {
                    'firstName': 'john', 'lastName': 'theapplicant'
                }
            };

            const data = {};

            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                testWrapper.testErrors(done, data, 'required', []);
            });

        });

        it(`test it redirects to next page when Yes selected: ${expectedNextUrlForApplicantPhone}`, (done) => {
            const sessionData = {
                'applicant': {
                    'firstName': 'john', 'lastName': 'theapplicant'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                const data = {
                    nameAsOnTheWill: 'Yes'
                };
                testWrapper.testRedirect(done, data, expectedNextUrlForApplicantPhone);
            });
        });

        it(`test it redirects to next page when No selected: ${expectedNextUrlForApplicantPhone}`, (done) => {
            const sessionData = {
                'applicant': {
                    'firstName': 'john', 'lastName': 'theapplicant'
                 }
            };

            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                const data = {
                    nameAsOnTheWill: 'No'
                };
                testWrapper.testRedirect(done, data, expectedNextUrlForApplicantPhone);
            });
        });
    });
});
