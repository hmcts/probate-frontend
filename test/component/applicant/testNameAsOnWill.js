'use strict';
const TestWrapper = require('test/util/TestWrapper');
const ApplicantPhone = require('app/steps/ui/applicant/phone');
const ApplicantAlias = require('app/steps/ui/applicant/alias');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('applicant-name-as-on-will', () => {
    let testWrapper;
    const expectedNextUrlForApplicantPhone = ApplicantPhone.getUrl();
    const expectedNextUrlForApplicantAlias = ApplicantAlias.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantNameAsOnWill');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantNameAsOnWill');

        it('test correct content is loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Draft',
                    id: 1234567890123456
                },
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                }
            };
            const contentToExclude = ['questionWithoutName', 'questionWithCodicil', 'legendWithCodicil'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        applicantName: 'John TheApplicant',
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test correct content is loaded on the page when there is a codicil', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Draft',
                    id: 1234567890123456
                },
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                },
                will: {
                    codicils: 'Yes'
                }
            };
            const contentToExclude = ['question', 'questionWithoutName', 'legend'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {

                    const contentData = {
                        applicantName: 'John TheApplicant',
                    };
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            const sessionData = {
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testErrors(done, {}, 'required');
                });
        });

        it(`test it redirects to next page when Yes selected: ${expectedNextUrlForApplicantPhone}`, (done) => {
            const sessionData = {
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
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

        it(`test it redirects to next page when No selected: ${expectedNextUrlForApplicantAlias}`, (done) => {
            const sessionData = {
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        nameAsOnTheWill: 'No'
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantAlias);
                });
        });
    });
});
