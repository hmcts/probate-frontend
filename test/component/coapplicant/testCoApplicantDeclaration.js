'use strict';

const TestWrapper = require('test/util/TestWrapper');
const json = require('app/resources/en/translation/coapplicant/declaration.json');
const sessionData = require('test/data/complete-form-undeclared');
const CoApplicantAgreePage = require('app/steps/ui/coapplicant/agreepage/index');
const CoApplicantDisagreePage = require('app/steps/ui/coapplicant/disagreepage/index');
const commonContent = require('app/resources/en/translation/common');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const nock = require('nock');
const config = require('app/config');
const businessServiceUrl = config.services.validation.url.replace('/validate', '');
const persistenceServiceUrl = config.services.persistence.url.replace('/formdata', '');
const invitesNock = () => {
    nock(businessServiceUrl)
        .get('/invites/allAgreed/undefined')
        .reply(200, 'false');
};

describe('co-applicant-declaration', () => {
    let testWrapper;
    const expectedNextUrlForCoAppAgree = CoApplicantAgreePage.getUrl();
    const expectedNextUrlForCoAppDisagree = CoApplicantDisagreePage.getUrl();

    beforeEach(() => {
        invitesNock();
        testWrapper = new TestWrapper('CoApplicantDeclaration');
    });

    afterEach(() => {
        nock.cleanAll();
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('CoApplicantDeclaration', invitesNock);

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

            testWrapper.agent.post('/prepare-session-field/inviteId/34')
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData.formdata)
                        .end(() => {
                            const data = {
                                agreement: json.optionYes
                            };
                            testWrapper.testRedirect(done, data, expectedNextUrlForCoAppAgree);
                        });
                });
        });

        it(`test it redirects to disagree page: ${expectedNextUrlForCoAppDisagree}`, (done) => {
            nock(persistenceServiceUrl)
                .patch('/invitedata/34')
                .reply(200, 'false');

            testWrapper.agent.post('/prepare-session-field/inviteId/34')
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData.formdata)
                        .end(() => {
                            const data = {
                                agreement: json.optionNo
                            };
                            testWrapper.testRedirect(done, data, expectedNextUrlForCoAppDisagree);
                        });
                });
        });

        it('test save and close link is not displayed on the page', (done) => {
            const playbackData = {
                saveAndClose: commonContent.saveAndClose,
                signOut: commonContent.signOut
            };

            testWrapper.agent
                .post('/prepare-session/form')
                .send({will: {}})
                .end(() => {
                    testWrapper.testContentNotPresent(done, playbackData);
                });
        });
    });
});
