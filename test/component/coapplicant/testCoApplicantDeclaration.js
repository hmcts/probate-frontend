'use strict';

const TestWrapper = require('test/util/TestWrapper');
const content = require('app/resources/en/translation/coapplicant/declaration.json');
const CoApplicantAgreePage = require('app/steps/ui/coapplicant/agreepage');
const CoApplicantDisagreePage = require('app/steps/ui/coapplicant/disagreepage');
const testCommonContent = require('test/component/common/testCommonContent.js');
const nock = require('nock');
const config = require('app/config');
const businessServiceUrl = config.services.validation.url.replace('/validate', '');
const persistenceServiceUrl = config.services.persistence.url.replace('/formdata', '');
let sessionData = require('test/data/complete-form-undeclared');
const beforeEachCallback = () => {
    nock(businessServiceUrl)
        .get('/invites/allAgreed/undefined')
        .reply(200, 'false');
};
const afterEachCallback = () => {
    nock.cleanAll();
};

describe('co-applicant-declaration', () => {
    let testWrapper;
    const expectedNextUrlForCoAppAgree = CoApplicantAgreePage.getUrl();
    const expectedNextUrlForCoAppDisagree = CoApplicantDisagreePage.getUrl();

    beforeEach(() => {
        beforeEachCallback();
        testWrapper = new TestWrapper('CoApplicantDeclaration');
    });

    afterEach(() => {
        testWrapper.destroy();
        afterEachCallback();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('CoApplicantDeclaration', beforeEachCallback, afterEachCallback, [], true);

        it('test right content loaded on the page', (done) => {
            const contentToExclude = [
                'executorNotApplyingHeader'
            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData.formdata)
                .end(() => {
                    const contentData = {
                        mainApplicantName: 'Bob Smith'
                    };

                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData.formdata)
                .end(() => {
                    const data = {};
                    testWrapper.testErrors(done, data, 'required', []);
                });
        });

        it(`test it redirects to agree page: ${expectedNextUrlForCoAppAgree}`, (done) => {
            nock(persistenceServiceUrl)
                .patch('/invitedata/34')
                .reply(200, 'false');

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
            nock(persistenceServiceUrl)
                .patch('/invitedata/34')
                .reply(200, 'false');

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
