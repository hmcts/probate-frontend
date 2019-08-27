'use strict';

const TestWrapper = require('test/util/TestWrapper');
const content = require('app/resources/en/translation/coapplicant/declaration.json');
const CoApplicantAgreePage = require('app/steps/ui/coapplicant/agreepage');
const CoApplicantDisagreePage = require('app/steps/ui/coapplicant/disagreepage');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('co-applicant-declaration', () => {
    let testWrapper;
    let sessionData;
    const expectedNextUrlForCoAppAgree = CoApplicantAgreePage.getUrl();
    const expectedNextUrlForCoAppDisagree = CoApplicantDisagreePage.getUrl();

    beforeEach(() => {
        sessionData = require('test/data/complete-form-undeclared').formdata;
        testWrapper = new TestWrapper('CoApplicantDeclaration');
    });

    afterEach(() => {
        delete require.cache[require.resolve('test/data/complete-form-undeclared')];
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('CoApplicantDeclaration', null, null, [], true);

        it('test right content loaded on the page', (done) => {
            const contentToExclude = [
                'executorNotApplyingHeader'
            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        mainApplicantName: 'Bob Smith'
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testErrors(done, {}, 'required');
                });
        });

        it(`test it redirects to agree page: ${expectedNextUrlForCoAppAgree}`, (done) => {
            sessionData = {};

            testWrapper.agent.post('/prepare-session-field/inviteId/34')
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            const data = {
                                agreement: content.optionYes
                            };
                            testWrapper.testRedirect(done, data, expectedNextUrlForCoAppAgree);
                        });
                });
        });

        it(`test it redirects to disagree page: ${expectedNextUrlForCoAppDisagree}`, (done) => {
            sessionData = {};

            testWrapper.agent.post('/prepare-session-field/inviteId/34')
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            const data = {
                                agreement: content.optionNo
                            };
                            testWrapper.testRedirect(done, data, expectedNextUrlForCoAppDisagree);
                        });
                });
        });
    });
});
