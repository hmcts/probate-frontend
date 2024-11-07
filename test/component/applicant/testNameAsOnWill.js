'use strict';
const TestWrapper = require('test/util/TestWrapper');
const ApplicantPhone = require('app/steps/ui/applicant/phone');
const ApplicantAlias = require('app/steps/ui/applicant/alias');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('applicant-name-as-on-will', () => {
    let testWrapper;
    const expectedNextUrlForApplicantPhone = ApplicantPhone.getUrl();
    const expectedNextUrlForApplicantAlias = ApplicantAlias.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantNameAsOnWill');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantNameAsOnWill', null, null, [], false, {type: caseTypes.GOP});

        it('test correct content is loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                }
            };
            const contentToExclude = ['questionWithoutName', 'questionWithCodicil', 'questionWithoutNameWithCodicil', 'legendWithCodicil'];

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
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                },
                will: {
                    codicils: 'optionYes'
                }
            };
            const contentToExclude = ['question', 'questionWithoutName', 'questionWithoutNameWithCodicil', 'legend'];

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
                        nameAsOnTheWill: 'optionYes'
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
                        nameAsOnTheWill: 'optionNo'
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantAlias);
                });
        });
    });
});
